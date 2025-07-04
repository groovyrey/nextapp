'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Messages";
    router.replace('/messages/public');
  }, [router]);

  return null;
}