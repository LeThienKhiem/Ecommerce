"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t, lang } = useLanguage();

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
          {t.back_to_home}
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
            {t.about_title}
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12 space-y-6">
          <p className="text-lg leading-relaxed text-gray-700">
            {t.about_content_1}
          </p>
          
          <p className="leading-relaxed text-gray-600">
            {t.about_content_2}
          </p>
          
          <p className="leading-relaxed text-gray-600">
            {t.about_content_3}
          </p>
        </div>
      </main>
    </div>
  );
}


