import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">Store</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-900 hover:text-gray-600 transition">
                Home
              </Link>
              <Link href="/products" className="text-gray-900 hover:text-gray-600 transition">
                Products
              </Link>
              <Link href="/about" className="text-gray-900 hover:text-gray-600 transition font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-gray-600 transition">
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-light text-gray-900 mb-8">About Us</h1>
        
        <div className="space-y-6 text-gray-600">
          <p className="text-lg leading-relaxed">
            Welcome to our modern, minimalist e-commerce store. We believe in simplicity, 
            quality, and exceptional customer experience.
          </p>
          
          <p className="leading-relaxed">
            Our mission is to curate a collection of products that combine form and function, 
            bringing you items that enhance your daily life while maintaining a clean, 
            uncluttered aesthetic.
          </p>
          
          <p className="leading-relaxed">
            Every product in our store has been carefully selected for its quality, design, 
            and value. We strive to offer a seamless shopping experience from discovery to 
            delivery.
          </p>
        </div>
      </section>
    </div>
  );
}


