import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Kilolook",
  description: "Privacy Policy for Kilolook - How we collect, use, and protect your personal information",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
            Privacy Policy
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12 space-y-8">
          {/* Section 1: Data Collection */}
          <section>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              Section 1: Data Collection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We collect personal information (Name, Phone Number, Shipping Address) strictly for order fulfillment and customer support.
            </p>
          </section>

          {/* Section 2: Data Usage & Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              Section 2: Data Usage & Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell your data. We only share necessary details with logistics partners (such as GHN, GHTK, Viettel Post) to complete the delivery.
            </p>
          </section>

          {/* Section 3: Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              Section 3: Cookies & Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This site uses cookies to enhance user experience and track affiliate referrals to maintain our operations.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}


