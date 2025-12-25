import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block p-8 mb-8">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        </div>

        <h1 className="text-6xl font-semibold text-apple-gray-900 mb-6">
          404
        </h1>
        
        <p className="text-xl text-gray-600 mb-4">
          Product Not Found
        </p>

        <p className="text-gray-500 mb-12 max-w-md mx-auto">
          The requested product does not exist or has been removed from our inventory.
        </p>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-apple-blue text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Products
        </Link>
      </main>
    </div>
  );
}

