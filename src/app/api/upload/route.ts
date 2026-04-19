import { put, del, list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as string; // "photo" or "music"

  if (!file || !type) {
    return NextResponse.json({ error: "Missing file or type" }, { status: 400 });
  }

  // Delete old file of same type
  try {
    const existing = await list({ prefix: `viht-${type}` });
    for (const blob of existing.blobs) {
      await del(blob.url);
    }
  } catch {}

  const ext = file.name.split(".").pop();
  const blob = await put(`viht-${type}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
