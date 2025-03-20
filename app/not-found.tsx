import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">404</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Page not found
        </p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
