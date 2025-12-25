"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
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

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowToast(true);
    }, 300);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      <Toast
        message={`${product.title} added to cart`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

