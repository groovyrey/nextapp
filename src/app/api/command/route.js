
import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function GET(request) {
  return new Promise((resolve) => {
    exec('ls -F', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        resolve(NextResponse.json({ error: 'Failed to execute command' }, { status: 500 }));
        return;
      }
      resolve(NextResponse.json({ output: stdout, error: stderr }));
    });
  });
}
