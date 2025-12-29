"use client";

import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-apple-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.back_to_home}
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 mb-4">
            {t.contact_title}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-8">
              {t.contact_get_in_touch}
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-apple-blue/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-apple-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-apple-gray-900 mb-2">
                    {t.contact_phone}
                  </h3>
                  <a 
                    href="tel:0868669897"
                    className="text-gray-600 hover:text-apple-blue transition-colors"
                  >
                    0868669897
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-8">
              {t.contact_send_message}
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contact_form_name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors"
                  placeholder={t.name}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contact_form_email} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors"
                  placeholder={t.contact_form_email}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contact_form_message} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-colors resize-none"
                  placeholder={t.message}
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-apple-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {t.contact_send_button}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


