import Link from "next/link";
import { ShoppingBag, Menu, Search, User, ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductsPage() {
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (99.99 + i * 10).toFixed(2),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">Store</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-900 hover:text-gray-600 transition">
                Home
              </Link>
              <Link href="/products" className="text-gray-900 hover:text-gray-600 transition font-medium">
                Products
              </Link>
              <Link href="/about" className="text-gray-900 hover:text-gray-600 transition">
                About
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-gray-600 transition">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-900 hover:text-gray-600 transition">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-900 hover:text-gray-600 transition">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-900 hover:text-gray-600 transition relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
              <button className="md:hidden p-2 text-gray-900">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-light text-gray-900">All Products</h1>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition">
            All
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition">
            Category 1
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition">
            Category 2
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition">
            Category 3
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:opacity-90 transition"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-900 font-medium mb-4">${product.price}</p>
              <button className="w-full border border-gray-900 text-gray-900 py-2 hover:bg-gray-900 hover:text-white transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


