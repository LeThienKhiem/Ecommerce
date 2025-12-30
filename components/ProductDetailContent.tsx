"use client";

import { Product } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductDetailActions from "./ProductDetailActions";
import Link from "next/link";
import { getLocalizedProductName, getLocalizedProductDescription } from "@/lib/localization";

interface ProductDetailContentProps {
  product: Product;
  price: string;
  originalPrice: string | null;
  discount: number | null;
}

export default function ProductDetailContent({
  product,
  price,
  originalPrice,
  discount,
}: ProductDetailContentProps) {
  const { t, lang } = useLanguage();
  const localizedName = getLocalizedProductName(product, lang);
  const localizedDescription = getLocalizedProductDescription(product, lang);

  return (
    <div className="space-y-6">
      {/* Category */}
      {product.category && (
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          {product.category}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900">
        {localizedName}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-4 py-4 border-t border-b border-gray-200">
        <div className="flex items-baseline gap-3">
          {originalPrice && (
            <span className="text-xl text-gray-400 line-through">
              {originalPrice}k
            </span>
          )}
          <span className="text-4xl font-semibold text-apple-gray-900">
            {price}k
          </span>
          <span className="text-lg text-gray-600">VND</span>
        </div>
        {discount && (
          <span className="text-sm text-red-500 font-medium">
            {t.product_save} {discount}%
          </span>
        )}
      </div>

      {/* Shipping Info */}
      <div className="text-green-600 font-bold">
        {t.product_shipping_time}
      </div>

      {/* Description */}
      {localizedDescription && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-apple-gray-900">
            {t.product_description_label}
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {localizedDescription}
          </p>
        </div>
      )}

      {/* Size Selection & Action Buttons */}
      <ProductDetailActions product={product} />

      {/* Product Info Table */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">
          {t.product_info}
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {product.category && (
            <>
              <div className="text-gray-600">{t.product_category_label}</div>
              <div className="text-apple-gray-900 font-medium">{product.category}</div>
            </>
          )}
          {product.slug && (
            <>
              <div className="text-gray-600">{t.product_code_label}</div>
              <div className="text-apple-gray-900 font-medium">{product.slug}</div>
            </>
          )}
          {!product.affiliate_link && product.stock !== undefined && (
            <>
              <div className="text-gray-600">{t.product_stock_label}</div>
              <div className={`font-medium ${product.stock > 0 ? "text-apple-gray-900" : "text-red-600"}`}>
                {product.stock > 0 ? `${product.stock} ${t.product_items}` : t.product_out_of_stock}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tags - Minimal Footer Style */}
      {product.tags && product.tags.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-4">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Link
                key={index}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


