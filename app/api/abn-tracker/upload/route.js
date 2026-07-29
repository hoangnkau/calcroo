import crypto from "crypto";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  if (!isAuthed())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin()
    .storage.from("receipts")
    .upload(path, Buffer.from(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ path });
}
