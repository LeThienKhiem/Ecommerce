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
      title: t.wholesale_feature_price_title,
      description: t.wholesale_feature_price_desc,
    },
    {
      icon: Package,
      title: t.wholesale_feature_stock_title,
      description: t.wholesale_feature_stock_desc,
    },
    {
      icon: ImageIcon,
      title: t.wholesale_feature_images_title,
      description: t.wholesale_feature_images_desc,
    },
    {
      icon: Truck,
      title: t.wholesale_feature_shipping_title,
      description: t.wholesale_feature_shipping_desc,
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
              {t.wholesale_hero_title}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 animate-fade-in-up animation-delay-200">
              {t.wholesale_hero_subtitle}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-3 bg-white text-apple-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-fade-in-up animation-delay-400"
            >
              <span>{t.wholesale_hero_cta}</span>
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
            {t.wholesale_seo_title}
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>
              {t.wholesale_seo_content_1}
            </p>

            <p>
              {t.wholesale_seo_content_2}
            </p>

            <p>
              {t.wholesale_seo_content_3}
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-apple-blue to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t.wholesale_cta_title}
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              {t.wholesale_cta_subtitle}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-apple-blue px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <span>{t.wholesale_cta_button}</span>
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
        message={t.wholesale_success}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </>
  );
}

