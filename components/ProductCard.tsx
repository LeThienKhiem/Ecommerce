"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;
  const price = product.price_selling 
    ? (product.price_selling / 1000).toFixed(0) 
    : "0";

  return (
    <div className="group">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-apple-gray-50 mb-4 overflow-hidden rounded-lg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-apple-gray-100"></div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <Link href={`/products/${product.slug}`}>
        <h3 className="text-lg font-medium text-apple-gray-900 mb-2 line-clamp-2 hover:text-apple-blue transition-colors">
          {product.title}
        </h3>
      </Link>
      
      <div className="flex items-center gap-3 mb-4">
        {product.price_original && product.price_original > product.price_selling && (
          <span className="text-sm text-gray-400 line-through">
            {product.price_original ? `${(product.price_original / 1000).toFixed(0)}k` : ""}
          </span>
        )}
        <p className="text-xl font-semibold text-apple-gray-900">
          {price}k VND
        </p>
      </div>
      
      <button 
        className="w-full bg-apple-blue text-white py-2 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
      >
        Add to Cart
      </button>
    </div>
  );
}

