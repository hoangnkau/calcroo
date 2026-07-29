import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  if (!isAuthed())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin()
    .from("abn_income")
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
    .from("abn_income")
    .insert({
      date: body.date,
      client: body.client || "",
      invoice_number: body.invoice_number || "",
      amount: body.amount,
      gst_collected: !!body.gst_collected,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
