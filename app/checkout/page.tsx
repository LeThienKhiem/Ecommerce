"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, CreditCard, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";

type PaymentMethod = "local_transfer" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("local_transfer");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showProfileSavedToast, setShowProfileSavedToast] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = 0; // Free shipping
  const finalTotal = totalPrice + shipping;

  // Auto-fill profile data on load
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Check if user is logged in
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          // User is not logged in (guest) - leave fields empty
          setIsLoadingProfile(false);
          return;
        }

        setUserId(user.id);

        // Fetch profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, phone, address")
          .eq("id", user.id)
          .single();

        if (profileError) {
          // If profile doesn't exist (PGRST116), that's okay - user can fill manually
          // PGRST116 = no rows returned
          if (profileError.code !== "PGRST116") {
            console.error("Error fetching profile:", profileError);
          }
          setIsLoadingProfile(false);
          return;
        }

        // Auto-fill form with profile data
        if (profile) {
          setFormData({
            name: profile.full_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        // Ensure loading state is cleared even on unexpected errors
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.phone || !formData.address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng.");
        setIsSubmitting(false);
        return;
      }

      // Debug: Log form data
      console.log("Form data before submit:", formData);
      console.log("Form data values:", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      
      // Prepare order data for Supabase - ensure all fields are strings
      const orderData = {
        customer_name: String(formData.name).trim(),
        phone: String(formData.phone).trim(),
        address: String(formData.address).trim(),
        total_price: finalTotal,
        payment_method: paymentMethod,
        products: cart.map((item) => ({
          product_id: item.product.id,
          title: item.product.title,
          slug: item.product.slug,
          price: item.product.price_selling,
          quantity: item.quantity,
          size: item.size || null,
          subtotal: (item.product.price_selling || 0) * item.quantity,
        })),
      };

      // Debug: Log order data before insert
      console.log("Order data to insert:", orderData);
      console.log("Order data JSON:", JSON.stringify(orderData, null, 2));

      // Insert order into Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log("Insert successful, returned data:", data);

      // Save order items to order_items table
      if (data && data.length > 0) {
        const orderId = data[0].id;
        const orderItems = cart.map((item) => ({
          order_id: orderId,
          product_id: item.product.id,
          title: item.product.title,
          slug: item.product.slug,
          price: item.product.price_selling,
          quantity: item.quantity,
          size: item.size || null,
          subtotal: (item.product.price_selling || 0) * item.quantity,
        }));

        const { error: orderItemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (orderItemsError) {
          console.error("Error saving order items:", orderItemsError);
          // Don't fail the order if order_items insert fails, but log it
        }
      }

      // Save/Update user profile (if logged in)
      if (userId) {
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: userId,
              full_name: formData.name.trim(),
              phone: formData.phone.trim(),
              address: formData.address.trim(),
            }, {
              onConflict: "id"
            });

          if (profileError) {
            console.error("Error saving profile:", profileError);
            // Don't block order success if profile save fails
          } else {
            // Show success toast
            setShowProfileSavedToast(true);
          }
        } catch (profileSaveError) {
          console.error("Error saving profile:", profileSaveError);
          // Continue with order success even if profile save fails
        }
      }

      // 3. Thành công
      console.log("Order placed successfully:", data);
      clearCart(); // Xóa giỏ hàng
      
      // Small delay to show toast before redirect
      // Clear any existing timeout first
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      
      redirectTimeoutRef.current = setTimeout(() => {
        router.push("/success"); // Chuyển trang
        redirectTimeoutRef.current = null;
      }, userId ? 1500 : 0); // Show toast for 1.5s if profile was saved

    } catch (error: any) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(`Đặt hàng thất bại: ${error.message || "Vui lòng thử lại sau."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
          <Link href="/" className="text-blue-600 hover:underline">
            Quay lại mua sắm
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại giỏ hàng
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: Form điền thông tin */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Thông tin giao hàng */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoadingProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-wait"
                    placeholder={isLoadingProfile ? "Đang tải..." : "Nguyễn Văn A"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isLoadingProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-wait"
                    placeholder={isLoadingProfile ? "Đang tải..." : "0912345678"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isLoadingProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-wait"
                    placeholder={isLoadingProfile ? "Đang tải..." : "Số nhà, tên đường, phường/xã, quận/huyện..."}
                  />
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-3">
                {/* Option 1: Chuyển khoản */}
                <label 
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "local_transfer" 
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="local_transfer"
                    checked={paymentMethod === "local_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Chuyển khoản ngân hàng (QR Code)</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Chuyển khoản trước, đơn hàng sẽ được xử lý ngay sau khi nhận được tiền.
                    </div>
                    
                    {/* Thông tin ngân hàng - Chỉ hiện khi chọn */}
                    {paymentMethod === "local_transfer" && (
                      <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                        <p className="font-bold text-blue-600 mb-2">Thông tin chuyển khoản:</p>
                        <ul className="space-y-1">
                          <li>Ngân hàng: <strong>Vietcombank (VCB)</strong></li>
                          <li>Số tài khoản: <strong>9999888866</strong></li>
                          <li>Chủ tài khoản: <strong>NGUYEN VAN A</strong></li>
                          <li>Nội dung: <strong>SDT Dat Hang</strong></li>
                        </ul>
                      </div>
                    )}
                  </div>
                </label>

                {/* Option 2: COD */}
                <label 
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod" 
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Bạn sẽ thanh toán tiền mặt cho shipper khi nhận được hàng.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-colors font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <>Đang xử lý...</>
              ) : (
                <>Hoàn tất đặt hàng - {(finalTotal / 1000).toFixed(0)}k</>
              )}
            </button>
          </div>

          {/* Toast for profile saved */}
          <Toast
            message="Thông tin của bạn đã được lưu cho lần sau"
            isVisible={showProfileSavedToast}
            onClose={() => setShowProfileSavedToast(false)}
            type="success"
          />

          {/* CỘT PHẢI: Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cart.map((item) => {
                   const imageUrl = item.product.images && item.product.images.length > 0
                    ? item.product.images[0]
                    : null;
                  return (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={item.product.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.title}
                          {item.size && (
                            <span className="text-xs font-normal text-gray-500 ml-1">
                              (Size: {item.size})
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                        <p className="text-sm font-medium">{(item.product.price_selling! / 1000).toFixed(0)}k ₫</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{(totalPrice / 1000).toFixed(0)}k ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-xl text-blue-600">{(finalTotal / 1000).toFixed(0)}k ₫</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}