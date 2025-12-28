"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import Toast from "./Toast";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddToCart = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsAdding(true);
    addToCart(product);
    
    timeoutRef.current = setTimeout(() => {
      setIsAdding(false);
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

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isAdding ? (lang === "vi" ? "Đang thêm..." : "Adding...") : t.add_to_cart}
      </button>
      <Toast
        message={lang === "vi" ? `${product.title} đã được thêm vào giỏ hàng` : `${product.title} has been added to cart`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

