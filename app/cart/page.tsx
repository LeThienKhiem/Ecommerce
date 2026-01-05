"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = 0; // Free shipping
  const finalTotal = totalPrice + shipping;

  const handleQuantityChange = (productId: number | string, newQuantity: number, size?: string) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
    } else {
      updateQuantity(productId, newQuantity, size);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tiếp Tục Mua Sắm
          </Link>

          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Giỏ Hàng Của Bạn Đang Trống
            </h2>
            <p className="text-gray-600 mb-8">
              Hãy bắt đầu thêm sản phẩm vào giỏ hàng
            </p>
            <Link
              href="/products"
              className="inline-block bg-apple-blue text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors font-medium"
            >
              Xem Sản Phẩm
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
          Giỏ Hàng
        </h1>

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
                  key={`${item.product.id || item.product.slug}-${item.size || 'no-size'}`}
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
                          unoptimized
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
                          {item.size && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              (Size: {item.size})
                            </span>
                          )}
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
                              item.quantity - 1,
                              item.size
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
                              item.quantity + 1,
                              item.size
                            )}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Tạm tính: <span className="font-medium text-apple-gray-900">{(itemTotal / 1000).toFixed(0)}k VND</span>
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id || item.product.slug, item.size)}
                          className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Xóa
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
                Tóm Tắt Đơn Hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} {totalItems === 1 ? "sản phẩm" : "sản phẩm"})</span>
                  <span className="font-medium text-apple-gray-900">
                    {(totalPrice / 1000).toFixed(0)}k VND
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí Vận Chuyển</span>
                  <span className="font-medium text-apple-gray-900">
                    {shipping === 0 ? "Miễn Phí" : `${(shipping / 1000).toFixed(0)}k VND`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-semibold text-apple-gray-900">Tổng Cộng</span>
                  <span className="text-xl font-semibold text-apple-gray-900">
                    {(finalTotal / 1000).toFixed(0)}k VND
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-apple-blue text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium text-center"
              >
                Tiến Hành Thanh Toán
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
