"use client";

import { useState, FormEvent, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { submitWholesaleContact } from "@/app/actions";
import { useLanguage } from "@/contexts/LanguageContext";

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WholesaleModal({ isOpen, onClose, onSuccess }: WholesaleModalProps) {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset success state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setError("");
      setFormData({
        name: "",
        phone: "",
        address: "",
        message: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await submitWholesaleContact(formData);

      if (result.success) {
        // Reset form
        setFormData({
          name: "",
          phone: "",
          address: "",
          message: "",
        });
        setShowSuccess(true);
        onSuccess();
        
        // Auto close after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-enter">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-apple-gray-900">
            {showSuccess 
              ? (lang === "vi" ? "Thành Công!" : "Success!")
              : (t.wholesale_form_title || "Đăng Ký Nhận Báo Giá Sỉ")
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
              {lang === "vi" ? "Chúng Tôi Đã Nhận Được Thông Tin Của Bạn!" : "We Have Received Your Information!"}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {lang === "vi" 
                ? "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
                : "Thank you for contacting us. We will contact you shortly."
              }
            </p>
            <button
              onClick={onClose}
              className="bg-apple-blue text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {lang === "vi" ? "Đóng" : "Close"}
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-2">
              {t.wholesale_form_name || "Họ và tên"} *
            </label>
            <input
              type="text"
              id="modal-name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors"
              placeholder={t.name || "Nhập họ và tên"}
            />
          </div>

          <div>
            <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t.wholesale_form_phone || "Số điện thoại"} *
            </label>
            <input
              type="tel"
              id="modal-phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors"
              placeholder={t.phone || "Nhập số điện thoại"}
            />
          </div>

          <div>
            <label htmlFor="modal-address" className="block text-sm font-medium text-gray-700 mb-2">
              {t.wholesale_form_address || "Địa chỉ"} *
            </label>
            <textarea
              id="modal-address"
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors resize-none"
              placeholder={t.address || "Nhập địa chỉ"}
            />
          </div>

          <div>
            <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700 mb-2">
              {t.wholesale_form_message || "Tin nhắn"} ({t.optional || "Tùy chọn"})
            </label>
            <textarea
              id="modal-message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors resize-none"
              placeholder={t.message || "Nhập tin nhắn (nếu có)"}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {lang === "vi" ? "Hủy" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-apple-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (lang === "vi" ? "Đang gửi..." : "Submitting...") 
                : (t.wholesale_submit || "Gửi Yêu Cầu")
              }
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

