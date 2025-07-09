import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'code');
  
  try {
    const filenames = fs.readdirSync(dir);
    return NextResponse.json(filenames);
  } catch (error) {
    console.error('Failed to read directory:', error);
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}
