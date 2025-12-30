"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "fil", name: "Filipino", flag: "🇵🇭" },
    { code: "km", name: "ភាសាខ្មែរ", flag: "🇰🇭" },
  ];

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/header.png"
              alt="Kilolook"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
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
            {/* Language Dropdown */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-apple-gray-900 transition-colors border border-gray-300 rounded-lg hover:border-apple-gray-900"
                title="Select Language"
              >
                <span>{currentLanguage.flag}</span>
                <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLang(language.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        lang === language.code
                          ? "bg-apple-blue/10 text-apple-blue font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                      {lang === language.code && (
                        <span className="ml-auto text-apple-blue">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-apple-gray-900 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute top-1 right-1 bg-apple-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {getTotalItems() > 99 ? "99+" : getTotalItems()}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-apple-gray-900 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="/" 
                onClick={closeMobileMenu}
                className={`block py-2 text-sm transition-colors duration-200 ${
                  isActive("/") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
                }`}
              >
                {t.home}
              </Link>
              <Link 
                href="/products" 
                onClick={closeMobileMenu}
                className={`block py-2 text-sm transition-colors duration-200 ${
                  isActive("/products") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
                }`}
              >
                {t.products}
              </Link>
              <Link 
                href="/wholesale" 
                onClick={closeMobileMenu}
                className={`block py-2 text-sm transition-colors duration-200 ${
                  isActive("/wholesale") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
                }`}
              >
                {t.wholesale}
              </Link>
              <Link 
                href="/about" 
                onClick={closeMobileMenu}
                className={`block py-2 text-sm transition-colors duration-200 ${
                  isActive("/about") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
                }`}
              >
                {t.about}
              </Link>
              <Link 
                href="/contact" 
                onClick={closeMobileMenu}
                className={`block py-2 text-sm transition-colors duration-200 ${
                  isActive("/contact") ? "text-apple-gray-900 font-medium" : "text-gray-600 hover:text-apple-gray-900"
                }`}
              >
                {t.contact}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

