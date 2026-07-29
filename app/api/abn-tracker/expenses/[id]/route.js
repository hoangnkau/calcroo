import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(request, { params }) {
  if (!isAuthed())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();

  const { data: existing } = await db
    .from("abn_expenses")
    .select("receipt_path")
    .eq("id", params.id)
    .single();

  const { error } = await db.from("abn_expenses").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing?.receipt_path) {
    await db.storage.from("receipts").remove([existing.receipt_path]);
  }

  return NextResponse.json({ ok: true });
}
