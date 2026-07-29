"use client";

import { useEffect, useState } from "react";

const CATEGORIES = [
  "Home office",
  "Vehicle & travel",
  "Tools & equipment",
  "Software & subscriptions",
  "Phone & internet",
  "Insurance & memberships",
  "Education & training",
  "Marketing & website",
  "Bank & accounting fees",
  "Other business expenses",
];

function fyOf(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const y = d.getFullYear();
  return d.getMonth() >= 6 ? y : y - 1;
}
function fyLabel(startYear) {
  return `FY${String(startYear).slice(2)}\u2013${String(startYear + 1).slice(2)}`;
}
function currentFYStart() {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
}
function fmt(n) {
  return "$" + Number(n || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function deductibleAmount(exp, gstReg) {
  let base = exp.amount * (exp.business_use_percent / 100);
  if (gstReg && exp.gst_included) base = base * (10 / 11);
  return base;
}
function gstCreditOf(exp, gstReg) {
  if (!gstReg || !exp.gst_included) return 0;
  return (exp.amount * (exp.business_use_percent / 100)) / 11;
}
function incomeExGst(inc, gstReg) {
  if (gstReg && inc.gst_collected) return inc.amount * (10 / 11);
  return inc.amount;
}
function gstCollectedOf(inc, gstReg) {
  if (!gstReg || !inc.gst_collected) return 0;
  return inc.amount / 11;
}
function toCSV(rows, headers) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AbnExpenseTracker() {
  const [authState, setAuthState] = useState("loading"); // loading | out | in
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    fetch("/api/abn-tracker/session")
      .then((r) => r.json())
      .then((d) => setAuthState(d.authenticated ? "in" : "out"))
      .catch(() => setAuthState("out"));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/abn-tracker/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthState("in");
    } else {
      const d = await res.json().catch(() => ({}));
      setAuthError(d.error || "Incorrect password.");
    }
  }

  if (authState === "loading") return null;

  if (authState === "out") {
    return (
      <div className="gate">
        <form onSubmit={handleLogin} className="gate-card">
          <h1>ABN ledger</h1>
          <p>Enter the password to view Kayla&rsquo;s expense records.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {authError && <div className="gate-error">{authError}</div>}
          <button type="submit">Unlock</button>
        </form>
        <style jsx>{`
          .gate { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
          .gate-card { background: #fff; border: 1px solid #d8d9d1; border-radius: 12px; padding: 28px; width: 100%; max-width: 340px; }
          .gate-card h1 { font-size: 22px; margin: 0 0 8px; }
          .gate-card p { font-size: 13px; color: #7c8895; margin: 0 0 16px; }
          .gate-card input { width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid #c2c4b8; font-size: 14px; margin-bottom: 12px; }
          .gate-card button { width: 100%; padding: 10px; border-radius: 8px; border: none; background: #1e2a38; color: #fff; font-size: 14px; cursor: pointer; }
          .gate-error { color: #a63d2f; font-size: 13px; margin-bottom: 12px; }
        `}</style>
      </div>
    );
  }

  return <Ledger />;
}

function Ledger() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [gstRegistered, setGstRegistered] = useState(false);
  const [fyStart, setFyStart] = useState(currentFYStart());
  const [tab, setTab] = useState("expenses");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expCategory, setExpCategory] = useState(CATEGORIES[0]);
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expBusUse, setExpBusUse] = useState(100);
  const [expGst, setExpGst] = useState(false);
  const [expReceiptPath, setExpReceiptPath] = useState(null);
  const [expReceiptName, setExpReceiptName] = useState("");
  const [uploading, setUploading] = useState(false);

  const [incDate, setIncDate] = useState(new Date().toISOString().slice(0, 10));
  const [incClient, setIncClient] = useState("");
  const [incInvoice, setIncInvoice] = useState("");
  const [incAmount, setIncAmount] = useState("");
  const [incGst, setIncGst] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [expRes, incRes, setRes] = await Promise.all([
      fetch("/api/abn-tracker/expenses").then((r) => r.json()),
      fetch("/api/abn-tracker/income").then((r) => r.json()),
      fetch("/api/abn-tracker/settings").then((r) => r.json()),
    ]);
    setExpenses(expRes.data || []);
    setIncome(incRes.data || []);
    setGstRegistered(!!setRes.data?.gst_registered);
  }

  async function toggleGstRegistered(checked) {
    setGstRegistered(checked);
    await fetch("/api/abn-tracker/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gst_registered: checked }),
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/abn-tracker/upload", { method: "POST", body: formData });
    const d = await res.json();
    setUploading(false);
    if (res.ok) {
      setExpReceiptPath(d.path);
      setExpReceiptName(file.name);
    } else {
      alert(d.error || "Upload failed.");
    }
  }

  async function viewReceipt(path) {
    const res = await fetch(`/api/abn-tracker/receipt-url?path=${encodeURIComponent(path)}`);
    const d = await res.json();
    if (res.ok) window.open(d.url, "_blank");
  }

  function resetExpenseForm() {
    setShowExpenseForm(false);
    setExpDesc("");
    setExpAmount("");
    setExpBusUse(100);
    setExpGst(false);
    setExpReceiptPath(null);
    setExpReceiptName("");
  }

  async function saveExpense() {
    if (!expDate || !expAmount) {
      alert("Please enter a date and amount.");
      return;
    }
    const res = await fetch("/api/abn-tracker/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: expDate,
        category: expCategory,
        description: expDesc,
        amount: parseFloat(expAmount),
        business_use_percent: parseFloat(expBusUse) || 100,
        gst_included: expGst,
        receipt_path: expReceiptPath,
      }),
    });
    const d = await res.json();
    if (res.ok) {
      setExpenses((prev) => [d.data, ...prev]);
      resetExpenseForm();
    } else {
      alert(d.error || "Could not save expense.");
    }
  }

  async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;
    const res = await fetch(`/api/abn-tracker/expenses/${id}`, { method: "DELETE" });
    if (res.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  async function saveIncome() {
    if (!incDate || !incAmount) {
      alert("Please enter a date and amount.");
      return;
    }
    const res = await fetch("/api/abn-tracker/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: incDate,
        client: incClient,
        invoice_number: incInvoice,
        amount: parseFloat(incAmount),
        gst_collected: incGst,
      }),
    });
    const d = await res.json();
    if (res.ok) {
      setIncome((prev) => [d.data, ...prev]);
      setShowIncomeForm(false);
      setIncClient("");
      setIncInvoice("");
      setIncAmount("");
      setIncGst(false);
    } else {
      alert(d.error || "Could not save income.");
    }
  }

  async function deleteIncome(id) {
    if (!confirm("Delete this income entry?")) return;
    const res = await fetch(`/api/abn-tracker/income/${id}`, { method: "DELETE" });
    if (res.ok) setIncome((prev) => prev.filter((e) => e.id !== id));
  }

  const years = Array.from(new Set([currentFYStart(), ...expenses.map((e) => fyOf(e.date)), ...income.map((e) => fyOf(e.date))])).sort((a, b) => b - a);

  const fyExpenses = expenses.filter((e) => fyOf(e.date) === fyStart).sort((a, b) => b.date.localeCompare(a.date));
  const fyIncome = income.filter((e) => fyOf(e.date) === fyStart).sort((a, b) => b.date.localeCompare(a.date));

  const totalDeductible = fyExpenses.reduce((s, e) => s + deductibleAmount(e, gstRegistered), 0);
  const totalIncomeExGst = fyIncome.reduce((s, e) => s + incomeExGst(e, gstRegistered), 0);
  const gstCollected = fyIncome.reduce((s, e) => s + gstCollectedOf(e, gstRegistered), 0);
  const gstCredits = fyExpenses.reduce((s, e) => s + gstCreditOf(e, gstRegistered), 0);
  const netGst = gstCollected - gstCredits;
  const taxableIncome = totalIncomeExGst - totalDeductible;

  const catTotals = {};
  CATEGORIES.forEach((c) => (catTotals[c] = 0));
  fyExpenses.forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + deductibleAmount(e, gstRegistered);
  });

  function exportExpensesCSV() {
    const rows = fyExpenses
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: e.date,
        category: e.category,
        description: e.description,
        amount_paid: e.amount.toFixed(2),
        business_use_percent: e.business_use_percent,
        gst_included: e.gst_included ? "yes" : "no",
        deductible_amount: deductibleAmount(e, gstRegistered).toFixed(2),
        has_receipt: e.receipt_path ? "yes" : "no",
      }));
    const csv = toCSV(rows, ["date", "category", "description", "amount_paid", "business_use_percent", "gst_included", "deductible_amount", "has_receipt"]);
    downloadCSV(csv, `kayla-bui-expenses-${fyLabel(fyStart)}.csv`);
  }

  function exportIncomeCSV() {
    const rows = fyIncome
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: e.date,
        client: e.client,
        invoice_number: e.invoice_number,
        amount_received: e.amount.toFixed(2),
        gst_collected: e.gst_collected ? "yes" : "no",
        amount_ex_gst: incomeExGst(e, gstRegistered).toFixed(2),
      }));
    const csv = toCSV(rows, ["date", "client", "invoice_number", "amount_received", "gst_collected", "amount_ex_gst"]);
    downloadCSV(csv, `kayla-bui-income-${fyLabel(fyStart)}.csv`);
  }

  return (
    <div className="wrap">
      <div className="header">
        <div>
          <h1>ABN ledger</h1>
          <div className="sub">Kayla Bui — business income &amp; expenses for tax time</div>
        </div>
        <div className="stamp">
          <span className="fy">{fyLabel(fyStart)}</span>
          <span className="label">on record</span>
        </div>
      </div>

      <div className="fybar">
        <label>Financial year</label>
        <select value={fyStart} onChange={(e) => setFyStart(parseInt(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>{fyLabel(y)}</option>
          ))}
        </select>
        <div className="toggle-gst">
          <input type="checkbox" checked={gstRegistered} onChange={(e) => toggleGstRegistered(e.target.checked)} />
          <label>Registered for GST</label>
        </div>
      </div>

      <div className="metrics">
        <div className="metric"><div className="label">Income (ex GST)</div><div className="value">{fmt(totalIncomeExGst)}</div></div>
        <div className="metric"><div className="label">Deductible expenses</div><div className="value">{fmt(totalDeductible)}</div></div>
        <div className={`metric ${taxableIncome >= 0 ? "pos" : "neg"}`}><div className="label">Est. taxable income</div><div className="value">{fmt(taxableIncome)}</div></div>
        <div className={`metric ${netGst >= 0 ? "" : "neg"}`}><div className="label">{gstRegistered ? "Net GST payable" : "GST tracking off"}</div><div className="value">{gstRegistered ? fmt(netGst) : "\u2014"}</div></div>
      </div>

      <div className="tabs">
        <div className={`tab ${tab === "expenses" ? "active" : ""}`} onClick={() => setTab("expenses")}>Expenses</div>
        <div className={`tab ${tab === "income" ? "active" : ""}`} onClick={() => setTab("income")}>Income</div>
        <div className={`tab ${tab === "reports" ? "active" : ""}`} onClick={() => setTab("reports")}>Reports</div>
      </div>

      {tab === "expenses" && (
        <div>
          <button className="add-toggle" onClick={() => setShowExpenseForm((v) => !v)}>+ Add expense</button>
          {showExpenseForm && (
            <div className="form-card open">
              <div className="form-grid">
                <div><label>Date</label><input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} /></div>
                <div>
                  <label>Category</label>
                  <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="full"><label>Description</label><input type="text" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="e.g. Adobe Creative Cloud subscription" /></div>
                <div><label>Amount paid (AUD)</label><input type="number" step="0.01" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder="0.00" /></div>
                <div><label>Business use %</label><input type="number" min="1" max="100" value={expBusUse} onChange={(e) => setExpBusUse(e.target.value)} /></div>
                <div className="full row-inline"><input type="checkbox" checked={expGst} onChange={(e) => setExpGst(e.target.checked)} /><label>Price includes GST</label></div>
                <div className="full">
                  <label>Receipt (photo or PDF)</label>
                  <label className={`receipt-drop ${expReceiptPath ? "has-file" : ""}`}>
                    {uploading ? "Uploading\u2026" : expReceiptPath ? `Attached: ${expReceiptName}` : "Click to attach a receipt"}
                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn" onClick={resetExpenseForm}>Cancel</button>
                <button className="btn-primary" onClick={saveExpense}>Save expense</button>
              </div>
            </div>
          )}

          {fyExpenses.length === 0 ? (
            <div className="empty">No expenses logged for this financial year yet.</div>
          ) : (
            <div>
              <div className="ledger-row head"><div>Date</div><div>Description</div><div style={{ textAlign: "right" }}>Deductible</div><div>Receipt</div><div></div></div>
              {fyExpenses.map((e) => (
                <div className="ledger-row" key={e.id}>
                  <div className="date">{e.date}</div>
                  <div className="desc"><span>{e.description || "(no description)"}</span><span className="cat">{e.category}{e.business_use_percent < 100 ? ` \u00b7 ${e.business_use_percent}% business use` : ""}</span></div>
                  <div className="amt">{fmt(deductibleAmount(e, gstRegistered))}</div>
                  <div className={`receipt-icon ${e.receipt_path ? "" : "none"}`} onClick={() => e.receipt_path && viewReceipt(e.receipt_path)} style={{ cursor: e.receipt_path ? "pointer" : "default" }}>{e.receipt_path ? "\u2713" : "\u2014"}</div>
                  <button className="del-btn" onClick={() => deleteExpense(e.id)} title="Delete">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "income" && (
        <div>
          <button className="add-toggle" onClick={() => setShowIncomeForm((v) => !v)}>+ Add income</button>
          {showIncomeForm && (
            <div className="form-card open">
              <div className="form-grid">
                <div><label>Date</label><input type="date" value={incDate} onChange={(e) => setIncDate(e.target.value)} /></div>
                <div><label>Client / payer</label><input type="text" value={incClient} onChange={(e) => setIncClient(e.target.value)} placeholder="e.g. Acme Pty Ltd" /></div>
                <div><label>Invoice number</label><input type="text" value={incInvoice} onChange={(e) => setIncInvoice(e.target.value)} placeholder="Optional" /></div>
                <div><label>Amount received (AUD)</label><input type="number" step="0.01" value={incAmount} onChange={(e) => setIncAmount(e.target.value)} placeholder="0.00" /></div>
                <div className="full row-inline"><input type="checkbox" checked={incGst} onChange={(e) => setIncGst(e.target.checked)} /><label>GST collected on this invoice</label></div>
              </div>
              <div className="form-actions">
                <button className="btn" onClick={() => setShowIncomeForm(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveIncome}>Save income</button>
              </div>
            </div>
          )}

          {fyIncome.length === 0 ? (
            <div className="empty">No income logged for this financial year yet.</div>
          ) : (
            <div>
              <div className="ledger-row head" style={{ gridTemplateColumns: "90px 1fr 130px 32px" }}><div>Date</div><div>Client / invoice</div><div style={{ textAlign: "right" }}>Amount (ex GST)</div><div></div></div>
              {fyIncome.map((e) => (
                <div className="ledger-row" style={{ gridTemplateColumns: "90px 1fr 130px 32px" }} key={e.id}>
                  <div className="date">{e.date}</div>
                  <div className="desc"><span>{e.client || "(no client)"}</span><span className="cat">{e.invoice_number || ""}</span></div>
                  <div className="amt">{fmt(incomeExGst(e, gstRegistered))}</div>
                  <button className="del-btn" onClick={() => deleteIncome(e.id)} title="Delete">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "reports" && (
        <div>
          <div className="report-section">
            <h3>By category (deductible amount)</h3>
            {CATEGORIES.filter((c) => catTotals[c] > 0).length === 0 ? (
              <div className="empty">No expenses to summarise yet.</div>
            ) : (
              CATEGORIES.filter((c) => catTotals[c] > 0).map((c) => (
                <div className="cat-row" key={c}><span>{c}</span><span className="amt">{fmt(catTotals[c])}</span></div>
              ))
            )}
          </div>
          <div className="report-section">
            <h3>Summary</h3>
            <div className="cat-row"><span>Total income (ex GST)</span><span className="amt">{fmt(totalIncomeExGst)}</span></div>
            <div className="cat-row"><span>Total deductible expenses</span><span className="amt">{fmt(totalDeductible)}</span></div>
            <div className="cat-row"><span>Estimated taxable income</span><span className="amt">{fmt(taxableIncome)}</span></div>
            {gstRegistered && (
              <>
                <div className="cat-row"><span>GST collected</span><span className="amt">{fmt(gstCollected)}</span></div>
                <div className="cat-row"><span>GST credits (paid)</span><span className="amt">{fmt(gstCredits)}</span></div>
                <div className="cat-row"><span>Net GST payable</span><span className="amt">{fmt(netGst)}</span></div>
              </>
            )}
          </div>
          <div className="export-bar">
            <button className="btn" onClick={exportExpensesCSV}>Export expenses CSV</button>
            <button className="btn" onClick={exportIncomeCSV}>Export income CSV</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .wrap { max-width: 920px; margin: 0 auto; padding: 32px 24px 80px; font-family: sans-serif; color: #1e2a38; }
        h1 { font-size: 26px; margin: 0; }
        .sub { font-size: 13px; color: #7c8895; margin-top: 4px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 28px; }
        .stamp { border: 1.5px solid #a63d2f; color: #a63d2f; border-radius: 50%; width: 92px; height: 92px; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-8deg); text-align: center; flex-shrink: 0; padding: 6px; }
        .stamp .fy { font-size: 13px; font-weight: 600; }
        .stamp .label { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
        .fybar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .fybar label { font-size: 13px; margin: 0; }
        .fybar select { font-size: 13px; padding: 7px 10px; border-radius: 8px; border: 1px solid #c2c4b8; }
        .toggle-gst { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4a5a6b; margin-left: auto; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
        .metric { background: #fff; border: 1px solid #d8d9d1; border-radius: 10px; padding: 14px 16px; }
        .metric .label { font-size: 11.5px; color: #7c8895; text-transform: uppercase; }
        .metric .value { font-size: 20px; margin-top: 6px; }
        .metric.pos .value { color: #3f7a5c; }
        .metric.neg .value { color: #a63d2f; }
        .tabs { display: flex; gap: 4px; border-bottom: 1px solid #c2c4b8; margin-bottom: 20px; }
        .tab { padding: 10px 16px; font-size: 14px; color: #7c8895; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; font-weight: 500; }
        .tab.active { color: #1e2a38; border-bottom-color: #a63d2f; }
        .add-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #fff; background: #1e2a38; border: none; border-radius: 8px; padding: 9px 14px; cursor: pointer; margin-bottom: 16px; }
        .form-card { background: #fff; border: 1px solid #d8d9d1; border-radius: 10px; padding: 18px; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-grid .full { grid-column: 1 / -1; }
        label { display: block; font-size: 12px; color: #4a5a6b; margin-bottom: 4px; font-weight: 500; }
        input[type="text"], input[type="number"], input[type="date"], select { width: 100%; font-size: 14px; padding: 8px 10px; border-radius: 8px; border: 1px solid #c2c4b8; background: #f1f2ee; color: #1e2a38; }
        .row-inline { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4a5a6b; }
        .row-inline label { margin: 0; }
        .receipt-drop { display: block; border: 1.5px dashed #c2c4b8; border-radius: 8px; padding: 16px; text-align: center; font-size: 13px; color: #7c8895; cursor: pointer; background: #f1f2ee; }
        .receipt-drop.has-file { border-color: #3f7a5c; color: #3f7a5c; }
        .form-actions { display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end; }
        .btn { border: 1px solid #c2c4b8; background: #fff; border-radius: 8px; padding: 9px 16px; font-size: 13px; color: #1e2a38; cursor: pointer; }
        .btn-primary { background: #1e2a38; color: #fff; border: none; border-radius: 8px; padding: 9px 16px; font-size: 13px; cursor: pointer; }
        .ledger-row { display: grid; grid-template-columns: 90px 1fr 130px 90px 32px; align-items: center; gap: 10px; padding: 12px 6px; border-bottom: 1px solid #d8d9d1; font-size: 13.5px; }
        .ledger-row.head { color: #7c8895; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #c2c4b8; padding-bottom: 8px; }
        .ledger-row .date { color: #4a5a6b; font-size: 12.5px; }
        .ledger-row .desc { display: flex; flex-direction: column; }
        .ledger-row .desc .cat { font-size: 11.5px; color: #7c8895; margin-top: 2px; }
        .ledger-row .amt { text-align: right; }
        .ledger-row .receipt-icon { color: #3f7a5c; text-align: center; }
        .ledger-row .receipt-icon.none { color: #c2c4b8; }
        .del-btn { background: none; border: none; color: #7c8895; font-size: 16px; padding: 2px; cursor: pointer; }
        .empty { padding: 32px 0; text-align: center; color: #7c8895; font-size: 13.5px; }
        .report-section { margin-bottom: 24px; }
        .report-section h3 { font-size: 15px; margin-bottom: 10px; }
        .cat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d8d9d1; font-size: 13.5px; }
        .export-bar { display: flex; gap: 8px; margin-top: 20px; }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .ledger-row { grid-template-columns: 70px 1fr 90px 28px; }
          .ledger-row .receipt-icon { display: none; }
        }
      `}</style>
    </div>
  );
}
