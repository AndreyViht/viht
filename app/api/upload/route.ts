import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const type = form.get('type') as string | null;

    if (!file || !type) {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
    }

    if (type !== 'photo' && type !== 'music') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Delete existing files of the same type to clear space (important for 1GB quota limit)
    const { blobs } = await list({ prefix: `${type}-` });
    for (const blob of blobs) {
      await del(blob.url);
    }

    // Generate new filename and upload
    const extension = file.name.split('.').pop() || 'tmp';
    const timestamp = Date.now();
    const newFilename = `${type}-${timestamp}.${extension}`;

    const blob = await put(newFilename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
