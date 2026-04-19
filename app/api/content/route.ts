import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { blobs } = await list();
    // Sort blobs by uploadedAt to get the latest ones
    const photoBlob = blobs
      .filter((b) => b.pathname.startsWith('photo-'))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
    
    const musicBlob = blobs
      .filter((b) => b.pathname.startsWith('music-'))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];

    const configBlob = blobs
      .filter((b) => b.pathname.startsWith('config-'))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
      
    let config = null;
    if (configBlob) {
      const res = await fetch(configBlob.url);
      if (res.ok) {
        config = await res.json();
      }
    }

    return NextResponse.json({
      photoUrl: photoBlob?.url || null,
      musicUrl: musicBlob?.url || null,
      config: config || null,
    });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
