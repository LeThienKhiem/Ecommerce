"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  mainImage: string | null;
  galleryImages: string[];
  productTitle: string;
  discount?: number | null;
}

export default function ProductImageGallery({
  mainImage,
  galleryImages,
  productTitle,
  discount,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  const displayImage = selectedImage || mainImage;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-apple-gray-50 rounded-lg overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={productTitle}
            width={800}
            height={800}
            className="w-full h-full object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-apple-gray-100"></div>
        )}

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            -{discount}%
          </div>
        )}
      </div>

      {/* Gallery Images */}
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {/* Show main image as first thumbnail */}
          {mainImage && (
            <button
              type="button"
              onClick={() => setSelectedImage(mainImage)}
              className={`aspect-square bg-apple-gray-50 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedImage === mainImage
                  ? "ring-2 ring-apple-blue"
                  : "hover:ring-2 ring-apple-blue ring-opacity-50"
              }`}
            >
              <Image
                src={mainImage}
                alt={productTitle}
                width={200}
                height={200}
                className="w-full h-full object-cover"
                unoptimized
              />
            </button>
          )}

          {/* Show gallery images */}
          {galleryImages.slice(0, mainImage ? 3 : 4).map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`aspect-square bg-apple-gray-50 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedImage === image
                  ? "ring-2 ring-apple-blue"
                  : "hover:ring-2 ring-apple-blue ring-opacity-50"
              }`}
            >
              <Image
                src={image}
                alt={`${productTitle} view ${index + 2}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


