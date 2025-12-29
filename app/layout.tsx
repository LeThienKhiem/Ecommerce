import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";

export const metadata: Metadata = {
  title: "Kilolook Store",
  description: "Modern minimalist e-commerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <LanguageProvider>
          <CartProvider>
            <SearchProvider>
              <FirebaseAnalytics />
              {children}
            </SearchProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
