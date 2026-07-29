import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  if (!isAuthed())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin()
    .from("abn_expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request) {
  if (!isAuthed())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));

  if (!body.date || !body.amount) {
    return NextResponse.json(
      { error: "date and amount are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("abn_expenses")
    .insert({
      date: body.date,
      category: body.category || "Other business expenses",
      description: body.description || "",
      amount: body.amount,
      business_use_percent: body.business_use_percent ?? 100,
      gst_included: !!body.gst_included,
      receipt_path: body.receipt_path || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
