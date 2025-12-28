"use client";

import { useState, FormEvent } from "react";
import { submitWholesaleContact } from "@/app/actions";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WholesalePage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitWholesaleContact(formData);

      if (result.success) {
        setToastMessage(t.wholesale_success);
        setToastType("success");
        setShowToast(true);
        // Reset form
        setFormData({
          name: "",
          phone: "",
          address: "",
          message: "",
        });
      } else {
        setToastMessage(result.message);
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-apple-gray-900 mb-4">
            {t.wholesale_title}
          </h1>
          <p className="text-gray-600 mb-8">
            {t.wholesale_description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t.wholesale_form_name} *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors"
                placeholder={t.name}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t.wholesale_form_phone} *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors"
                placeholder={t.phone}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                {t.wholesale_form_address} *
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors resize-none"
                placeholder={t.address}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {t.wholesale_form_message} ({t.optional})
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors resize-none"
                placeholder={t.message}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-apple-blue text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (t.lang === "vi" ? "Đang gửi..." : "Submitting...") : t.wholesale_submit}
            </button>
          </form>
        </div>
      </main>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </div>
  );
}

