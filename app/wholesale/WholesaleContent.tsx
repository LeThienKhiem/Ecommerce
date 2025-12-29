"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, DollarSign, Truck, Image as ImageIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import WholesaleModal from "@/components/WholesaleModal";
import Toast from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WholesaleContent() {
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSuccess = () => {
    setShowToast(true);
  };

  const features = [
    {
      icon: DollarSign,
      title: "Giá Rẻ Nhất",
      description: "Giá sỉ tận gốc, không qua trung gian, chiết khấu cao cho đơn hàng số lượng lớn",
    },
    {
      icon: Package,
      title: "Sẵn Hàng Số Lượng Lớn",
      description: "Kho hàng luôn đầy đủ, đáp ứng mọi nhu cầu nhập sỉ với số lượng lớn",
    },
    {
      icon: ImageIcon,
      title: "Hỗ Trợ Hình Ảnh",
      description: "Cung cấp đầy đủ hình ảnh sản phẩm chất lượng cao để hỗ trợ bán hàng",
    },
    {
      icon: Truck,
      title: "Giao Hàng Toàn Quốc",
      description: "Vận chuyển nhanh chóng, an toàn đến mọi tỉnh thành trên cả nước",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image */}
        <Image
          src="/wholesale-bg.png"
          alt="Kho sỉ quần áo"
          fill
          priority
          className="object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
              Kho Sỉ Quần Áo Lớn Nhất - Giá Rẻ Tận Gốc
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 animate-fade-in-up animation-delay-200">
              Nguồn hàng ổn định - Số lượng lớn - Luôn đầy hàng
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-3 bg-white text-apple-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-fade-in-up animation-delay-400"
            >
              <span>Liên Hệ Nhập Sỉ Ngay</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-apple-blue/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-apple-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-apple-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <article className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-900 mb-8">
            Tại Sao Nên Chọn Kilolook Làm Đối Tác Bán Sỉ?
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>
              Kilolook tự hào là <strong className="text-apple-gray-900">nguồn hàng sỉ quần áo</strong> uy tín hàng đầu, 
              chuyên cung cấp <strong className="text-apple-gray-900">quần áo giá rẻ</strong> tận gốc cho các đối tác 
              kinh doanh trên toàn quốc. Với nhiều năm kinh nghiệm trong lĩnh vực <strong className="text-apple-gray-900">bán sỉ quần áo</strong>, 
              chúng tôi cam kết mang đến cho bạn những sản phẩm chất lượng với mức giá cạnh tranh nhất thị trường.
            </p>

            <p>
              Điểm mạnh của Kilolook là <strong className="text-apple-gray-900">nguồn hàng ổn định</strong>, 
              không qua trung gian, giúp bạn có được mức giá tốt nhất. Chúng tôi sở hữu <strong className="text-apple-gray-900">kho sỉ số lượng lớn</strong> 
              với hàng nghìn sản phẩm luôn có sẵn, đáp ứng mọi nhu cầu <strong className="text-apple-gray-900">buôn bán quần áo</strong> 
              của bạn. Từ áo thun, quần jean, váy đầm đến các phụ kiện thời trang, tất cả đều được tuyển chọn kỹ lưỡng 
              để đảm bảo chất lượng và xu hướng thời trang mới nhất.
            </p>

            <p>
              Khi hợp tác với Kilolook, bạn sẽ nhận được nhiều ưu đãi đặc biệt: chiết khấu cao cho đơn hàng số lượng lớn, 
              hỗ trợ hình ảnh sản phẩm chất lượng, giao hàng nhanh chóng toàn quốc, và đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng 
              hỗ trợ bạn 24/7. Chúng tôi hiểu rằng thành công của bạn chính là thành công của chúng tôi, vì vậy chúng tôi luôn 
              nỗ lực để trở thành đối tác đáng tin cậy nhất trong hành trình kinh doanh của bạn.
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-apple-blue to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Sẵn Sàng Bắt Đầu Kinh Doanh?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Đăng ký ngay để nhận báo giá sỉ tốt nhất và trở thành đối tác của chúng tôi
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-apple-blue px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <span>Đăng Ký Nhận Báo Giá Ngay</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </article>

      {/* Modal */}
      <WholesaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Toast */}
      <Toast
        message={lang === "vi" ? "Gửi thông tin thành công! Chúng tôi sẽ liên hệ trong 24h" : "Success! We will contact you within 24 hours"}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </>
  );
}

