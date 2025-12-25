import Link from "next/link";
import { ShoppingBag, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
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
              <Link href="/about" className="text-gray-900 hover:text-gray-600 transition">
                About
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-gray-600 transition font-medium">
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

        <h1 className="text-4xl font-light text-gray-900 mb-12">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">hello@store.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-gray-900 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">123 Commerce St<br />City, State 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900 transition"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900 transition"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-900 transition"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}


