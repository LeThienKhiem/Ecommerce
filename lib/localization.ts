import { Product, ProductTranslation } from "@/types/product";
import { Language } from "@/constants/dictionary";

/**
 * Get localized content for a product field
 * @param product - The product object
 * @param lang - The target language
 * @param field - The field to localize ('name', 'description', or 'slug')
 * @returns The localized content, falling back to Vietnamese if not available
 */
export function getLocalizedContent(
  product: Product,
  lang: Language,
  field: "name" | "description" | "slug"
): string {
  // If Vietnamese, return the main column
  if (lang === "vi") {
    switch (field) {
      case "name":
        return product.title || "";
      case "description":
        return product.description || "";
      case "slug":
        return product.slug || "";
    }
  }

  // For other languages, check translations JSONB
  const translation = product.translations?.[lang];
  if (translation) {
    switch (field) {
      case "name":
        if (translation.name) return translation.name;
        break;
      case "description":
        if (translation.description) return translation.description;
        break;
      case "slug":
        if (translation.slug) return translation.slug;
        break;
    }
  }

  // Fallback to Vietnamese
  switch (field) {
    case "name":
      return product.title || "";
    case "description":
      return product.description || "";
    case "slug":
      return product.slug || "";
  }
}

/**
 * Get localized product name
 */
export function getLocalizedProductName(product: Product, lang: Language): string {
  return getLocalizedContent(product, lang, "name");
}

/**
 * Get localized product description
 */
export function getLocalizedProductDescription(product: Product, lang: Language): string {
  return getLocalizedContent(product, lang, "description");
}

/**
 * Get localized product slug
 */
export function getLocalizedProductSlug(product: Product, lang: Language): string {
  return getLocalizedContent(product, lang, "slug");
}

