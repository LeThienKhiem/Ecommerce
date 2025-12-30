import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Kilolook",
  description: "Terms of Service for Kilolook - Hybrid retail and intermediary service provider",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-lg leading-relaxed text-gray-700">
              Welcome to Kilolook. By accessing our site, you agree to these terms. We operate as a hybrid retail and intermediary service provider.
            </p>
          </section>

          {/* Section 1: Order & Intermediary Services */}
          <section>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              Section 1: Order & Intermediary Services
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Kilolook acts as an intermediary agent to facilitate purchases and shipments from international suppliers. We are not the manufacturer of these goods.
              </p>
              <p>
                <strong>Shipping:</strong> Standard delivery takes 7-15 business days. Customers acknowledge that delays due to customs clearance, holidays, or logistics are beyond our control and Kilolook is not liable for such delays.
              </p>
            </div>
          </section>

          {/* Section 2: Affiliate & Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              Section 2: Affiliate & Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Some products contain links to third-party marketplaces (e.g., Shopee, Lazada). Transactions made on these external sites are governed by their respective terms. Kilolook is not responsible for the payment, shipping, or quality of items purchased through affiliate links.
            </p>
          </section>

          {/* Section 3: Returns & Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              Section 3: Returns & Refunds
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Direct Orders:</strong> Returns accepted within 3 days for manufacturer defects.
              </p>
              <p>
                <strong>Affiliate Orders:</strong> Subject to the policy of the third-party seller.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

