"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProductDetailBackButton() {
  const { t } = useLanguage();

  return (
    <Link 
      href="/products" 
      className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {t.product_back_to_products}
    </Link>
  );
}


