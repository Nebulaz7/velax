import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Velax</h1>
      <p className="text-lg mb-8">
        The first instant-refund NFT marketplace on Sui.
      </p>
      <Link
        href="/create"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Create a Listing
      </Link>
    </div>
  );
}
