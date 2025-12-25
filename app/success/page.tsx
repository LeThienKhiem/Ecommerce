import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import Header from "@/components/Header";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
            Cảm Ơn Bạn Đã Đặt Hàng!
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Đơn hàng của bạn đã được tiếp nhận và đang được xử lý. Chúng tôi sẽ gửi email xác nhận cho bạn trong thời gian sớm nhất.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-apple-blue text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-colors font-medium text-lg"
            >
              <Home className="h-5 w-5" />
              Về Trang Chủ
            </Link>

            <div className="pt-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-apple-gray-900 transition-colors"
              >
                Tiếp Tục Mua Sắm
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

