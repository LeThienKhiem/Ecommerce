"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import AddToCartButton from "./AddToCartButton";
import Toast from "./Toast";

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : [];
  const isDirectSale = !product.affiliate_link;
  const requiresSize = isDirectSale && sizes.length > 0;

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const handleAddToCartClick = () => {
    if (requiresSize && !selectedSize) {
      setShowSizeError(true);
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-apple-gray-900">
              Kích thước / Size {requiresSize && <span className="text-red-500">*</span>}
            </label>
            {selectedSize && (
              <span className="text-sm text-gray-500">Đã chọn: {selectedSize}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeClick(size)}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                  selectedSize === size
                    ? "border-apple-blue bg-apple-blue text-white"
                    : showSizeError && requiresSize
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-300 bg-white text-apple-gray-900 hover:border-apple-blue hover:bg-blue-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {showSizeError && requiresSize && (
            <p className="text-sm text-red-600">Vui lòng chọn Size</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-6">
        {product.affiliate_link ? (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium text-center block"
          >
            Mua ngay trên Shopee
          </a>
        ) : (
          <>
            <AddToCartButton 
              product={product} 
              selectedSize={selectedSize}
              onBeforeAdd={handleAddToCartClick}
            />
            {product.stock !== undefined && product.stock > 0 && (
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-apple-gray-900 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Thanh Toán
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

