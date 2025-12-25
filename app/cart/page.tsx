"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = 0; // Free shipping
  const finalTotal = totalPrice + shipping;

  const handleQuantityChange = (productId: number | string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Here you would normally send order to backend
      console.log("Order details:", { cart, orderInfo, total: finalTotal });
      
      // Clear cart after successful order
      clearCart();
      setShowCheckout(false);
      setIsCheckingOut(false);
      
      // Show success message or redirect
      alert("Order placed successfully! Payment instructions have been sent to your email.");
    }, 2000);
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>

          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding items to your cart
            </p>
            <Link
              href="/products"
              className="inline-block bg-apple-blue text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold text-apple-gray-900 mb-8">
          Shopping Cart
        </h1>

        {!showCheckout ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const imageUrl = item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : null;
                const price = item.product.price_selling
                  ? (item.product.price_selling / 1000).toFixed(0)
                  : "0";
                const itemTotal = (item.product.price_selling || 0) * item.quantity;

                return (
                  <div
                    key={item.product.id || item.product.slug}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="flex-shrink-0 w-full sm:w-24 h-24 bg-apple-gray-50 rounded-lg overflow-hidden"
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-apple-gray-100"></div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="block"
                        >
                          <h3 className="text-lg font-medium text-apple-gray-900 mb-2 hover:text-apple-blue transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between">
                          <div className="text-xl font-semibold text-apple-gray-900">
                            {price}k VND
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(
                                item.product.id || item.product.slug,
                                item.quantity - 1
                              )}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-apple-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(
                                item.product.id || item.product.slug,
                                item.quantity + 1
                              )}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Subtotal: <span className="font-medium text-apple-gray-900">{(itemTotal / 1000).toFixed(0)}k VND</span>
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id || item.product.slug)}
                            className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                    <span className="font-medium text-apple-gray-900">
                      {(totalPrice / 1000).toFixed(0)}k VND
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-apple-gray-900">
                      {shipping === 0 ? "Free" : `${(shipping / 1000).toFixed(0)}k VND`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-apple-gray-900">Total</span>
                    <span className="text-xl font-semibold text-apple-gray-900">
                      {(finalTotal / 1000).toFixed(0)}k VND
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-apple-gray-900 mb-6">
                Checkout
              </h2>

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-apple-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={orderInfo.name}
                        onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={orderInfo.email}
                        onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={orderInfo.phone}
                        onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-apple-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={3}
                      value={orderInfo.address}
                      onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={orderInfo.notes}
                    onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                    placeholder="Any special instructions for your order..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  />
                </div>

                {/* Payment Information */}
                <div className="bg-apple-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-apple-gray-900 mb-4">
                    Payment Information
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      Please transfer the payment to the following account:
                    </p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Bank Name:</span>
                        <span>Vietcombank (VCB)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Account Number:</span>
                        <span className="font-mono">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Account Holder:</span>
                        <span>Kilolook Store</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span className="text-lg font-semibold text-apple-blue">
                          {(finalTotal / 1000).toFixed(0)}k VND
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      * Please include your order number in the payment description. 
                      Order confirmation and payment instructions will be sent to your email.
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-apple-gray-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    {cart.map((item) => (
                      <div key={item.product.id || item.product.slug} className="flex justify-between text-gray-600">
                        <span>
                          {item.product.title} × {item.quantity}
                        </span>
                        <span className="font-medium text-apple-gray-900">
                          {(((item.product.price_selling || 0) * item.quantity) / 1000).toFixed(0)}k VND
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t border-gray-200 font-semibold text-apple-gray-900">
                      <span>Total</span>
                      <span>{(finalTotal / 1000).toFixed(0)}k VND</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 border border-gray-300 text-apple-gray-900 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="flex-1 bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


