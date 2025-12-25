import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

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
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

