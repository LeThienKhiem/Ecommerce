"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Product } from "@/types/product";

interface CartItem {
  product: Product;
  quantity: number;
}

interface AddToCartResult {
  success: boolean;
  message?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => AddToCartResult;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage with debounce to prevent excessive writes
  useEffect(() => {
    if (mounted) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounce localStorage writes to prevent memory leaks from rapid updates
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        saveTimeoutRef.current = null;
      }, 300); // 300ms debounce
    }
    
    // Cleanup timeout on unmount or when cart changes
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [cart, mounted]);

  const addToCart = (product: Product, quantity: number = 1): AddToCartResult => {
    // Check if product is affiliate (no stock management)
    if (product.affiliate_link) {
      // Affiliate products can always be added (no stock check)
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id || item.product.slug === product.slug
        );

        if (existingItem) {
          return prevCart.map((item) =>
            (item.product.id === product.id || item.product.slug === product.slug)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...prevCart, { product, quantity }];
      });
      return { success: true };
    }

    // Direct sale products: Check stock
    const currentStock = product.stock ?? 0;
    if (currentStock <= 0) {
      return {
        success: false,
        message: "Sản phẩm đã hết hàng",
      };
    }

    // Use functional update to check stock against current cart state
    let stockValidationFailed = false;
    let errorMessage = "";

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id || item.product.slug === product.slug
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > currentStock) {
          stockValidationFailed = true;
          errorMessage = `Chỉ còn ${currentStock} sản phẩm trong kho`;
          return prevCart; // Don't update
        }
        return prevCart.map((item) =>
          (item.product.id === product.id || item.product.slug === product.slug)
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      // New item: check if quantity exceeds stock
      if (quantity > currentStock) {
        stockValidationFailed = true;
        errorMessage = `Chỉ còn ${currentStock} sản phẩm trong kho`;
        return prevCart; // Don't add
      }

      return [...prevCart, { product, quantity }];
    });

    if (stockValidationFailed) {
      return {
        success: false,
        message: errorMessage,
      };
    }

    return { success: true };
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.product.id !== productId && item.product.slug !== productId
      )
    );
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId || item.product.slug === productId) {
          // Check stock for direct sale products
          if (!item.product.affiliate_link && item.product.stock !== undefined) {
            const availableStock = item.product.stock;
            if (quantity > availableStock) {
              // Limit quantity to available stock
              return { ...item, quantity: availableStock };
            }
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + (item.product.price_selling || 0) * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


