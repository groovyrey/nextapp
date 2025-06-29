import { notFound } from 'next/navigation';
import { Suspense } from 'react';

async function getUser(id) {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/user/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) {
      return null; // User not found
    }
    throw new Error('Failed to fetch user data');
  }
  return res.json();
}

function UserDetails({ user }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-2"><strong>First Name:</strong> {user.firstName}</p>
        <p className="text-lg mb-2"><strong>Last Name:</strong> {user.lastName}</p>
        <p className="text-lg mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-lg mb-2"><strong>Age:</strong> {user.age}</p>
      </div>
    </div>
  );
}

export default async function UserDetailPage({ params }) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading user data...</div>}>
      <UserDetails user={user} />
    </Suspense>
  );
}
