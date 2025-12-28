"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import Toast from "./Toast";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  selectedSize?: string | null;
  onBeforeAdd?: () => boolean;
}

export default function AddToCartButton({ product, className = "", selectedSize, onBeforeAdd }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if product is out of stock (for direct sale products)
  const isOutOfStock = !product.affiliate_link && (product.stock === undefined || product.stock <= 0);

  const handleAddToCart = () => {
    // Call onBeforeAdd callback if provided (for size validation)
    if (onBeforeAdd && !onBeforeAdd()) {
      return;
    }

    // Don't allow adding out of stock items
    if (isOutOfStock) {
      setToastMessage(lang === "vi" ? "Sản phẩm đã hết hàng" : "Product is out of stock");
      setShowToast(true);
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsAdding(true);
    const result = addToCart(product, 1, selectedSize || undefined);
    
    if (!result.success) {
      // Stock validation failed
      setToastMessage(result.message || (lang === "vi" ? "Không đủ số lượng tồn kho" : "Insufficient stock"));
      setShowToast(true);
      setIsAdding(false);
      return;
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsAdding(false);
      setToastMessage(lang === "vi" ? `${product.title} đã được thêm vào giỏ hàng` : `${product.title} has been added to cart`);
      setShowToast(true);
      timeoutRef.current = null;
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Determine button text and state
  const getButtonText = () => {
    if (isOutOfStock) {
      return lang === "vi" ? "Hết hàng" : "Sold Out";
    }
    if (isAdding) {
      return lang === "vi" ? "Đang thêm..." : "Adding...";
    }
    return t.add_to_cart;
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isOutOfStock}
        className={`w-full py-3 rounded-full transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
          isOutOfStock
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-apple-blue text-white hover:bg-blue-600"
        } ${className}`}
      >
        {getButtonText()}
      </button>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={isOutOfStock ? "error" : "success"}
      />
    </>
  );
}

