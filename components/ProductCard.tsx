"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import AddToCartButton from "./AddToCartButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedProductName, getLocalizedProductSlug } from "@/lib/localization";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { t, lang } = useLanguage();
  const localizedName = getLocalizedProductName(product, lang);
  const localizedSlug = getLocalizedProductSlug(product, lang);
  const images = product.images && product.images.length > 0 ? product.images : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const price = product.price_selling 
    ? (product.price_selling / 1000).toFixed(0) 
    : "0";

  // Detect if mobile device
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Intersection Observer for mobile visibility detection with debounce
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Debounce fast scrolling - delay state update
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          debounceTimerRef.current = setTimeout(() => {
            setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
          }, 200); // 200ms debounce for fast scrolling
        });
      },
      {
        threshold: 0.5,
        rootMargin: "50px", // Start loading slightly before visible
      }
    );

    observer.observe(cardRef.current);

    // MANDATORY CLEANUP: Disconnect observer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      observer.disconnect(); // Complete cleanup
    };
  }, []);

  // Unified image cycling logic with safety constraints
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // Only start if hovering OR (isMobile AND isVisible)
    if ((isHovered || (isMobile && isVisible)) && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500); // Slow down to 1.5s to save CPU
    } else {
      // Reset to first image when not active
      setCurrentImageIndex(0);
    }

    // CLEANUP IS MANDATORY - Always clear interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isHovered, isMobile, isVisible, images.length]); // Do NOT include currentImageIndex here

  const currentImage = images.length > 0 ? images[currentImageIndex] : null;

  return (
    <div className="group break-inside-avoid mb-4 h-auto" ref={cardRef}>
      {/* Product Image */}
      <Link href={`/products/${localizedSlug}`}>
        <div
          className="w-full mb-4 overflow-hidden rounded-lg relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {currentImage ? (
            <div className="relative w-full">
              {/* First image in normal flow to establish container height for masonry */}
              <Image
                src={images[0]}
                alt={`${localizedName} - Image 1`}
                width={500}
                height={500}
                className={`w-full h-auto transition-opacity duration-500 ${
                  currentImageIndex === 0 ? "opacity-100" : "opacity-0"
                }`}
                unoptimized
              />
              {/* Other images absolutely positioned for overlay effect */}
              {images.slice(1).map((image, idx) => {
                const actualIdx = idx + 1;
                return (
                  <Image
                    key={actualIdx}
                    src={image}
                    alt={`${localizedName} - Image ${actualIdx + 1}`}
                    width={500}
                    height={500}
                    className={`absolute top-0 left-0 w-full h-auto transition-opacity duration-500 ${
                      actualIdx === currentImageIndex
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    unoptimized
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full h-64 bg-apple-gray-100"></div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <Link href={`/products/${localizedSlug}`}>
        <h3 className="text-lg font-medium text-apple-gray-900 mb-2 line-clamp-2 hover:text-apple-blue transition-colors">
          {localizedName}
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
      
      {/* Hybrid Button Logic: Affiliate vs Direct Sale */}
      {product.affiliate_link ? (
        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium text-center block text-sm"
        >
          {t.product_buy_on_shopee}
        </a>
      ) : (
        <AddToCartButton product={product} className="w-full text-sm font-medium" />
      )}
    </div>
  );
}

