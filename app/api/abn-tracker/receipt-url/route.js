import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request) {
  if (!isAuthed())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path)
    return NextResponse.json({ error: "Missing path." }, { status: 400 });

  const { data, error } = await supabaseAdmin()
    .storage.from("receipts")
    .createSignedUrl(path, 60 * 10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: data.signedUrl });
}
