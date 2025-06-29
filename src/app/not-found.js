import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">Could not find the requested resource.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
        Return Home
      </Link>
    </div>
  );
}
