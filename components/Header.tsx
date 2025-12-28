"use client";

import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { lang, setLang, t } = useLanguage();

  const isActive = (path: string) => pathname === path;

  const toggleLanguage = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-apple-gray-900">
              Kilolook Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm transition-colors duration-200 ${
                isActive("/") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
              }`}
            >
              {t.home}
            </Link>
            <Link 
              href="/products" 
              className={`text-sm transition-colors duration-200 ${
                isActive("/products") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
              }`}
            >
              {t.products}
            </Link>
            <Link 
              href="/wholesale" 
              className={`text-sm transition-colors duration-200 ${
                isActive("/wholesale") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
              }`}
            >
              {t.wholesale}
            </Link>
            <Link 
              href="/about" 
              className={`text-sm transition-colors duration-200 ${
                isActive("/about") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
              }`}
            >
              {t.about}
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm transition-colors duration-200 ${
                isActive("/contact") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
              }`}
            >
              {t.contact}
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <SearchBar />
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-apple-gray-900 transition-colors border border-gray-300 rounded-lg hover:border-apple-gray-900"
              title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            >
              {lang === "vi" ? "EN" : "VN"}
            </button>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-apple-gray-900 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute top-1 right-1 bg-apple-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {getTotalItems() > 99 ? "99+" : getTotalItems()}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 text-gray-600">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

