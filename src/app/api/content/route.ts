import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blobs = await list({ prefix: "viht-" });

    let photo: string | null = null;
    let music: string | null = null;

    for (const blob of blobs.blobs) {
      if (blob.pathname.startsWith("viht-photo")) photo = blob.url;
      if (blob.pathname.startsWith("viht-music")) music = blob.url;
    }

    return NextResponse.json({ photo, music });
  } catch {
    return NextResponse.json({ photo: null, music: null });
  }
}
