"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, ShoppingBag, Plus, Trash2, CheckCircle2, Upload, FileText, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { generateSlug } from "@/lib/utils";
import Papa from "papaparse";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importTab, setImportTab] = useState<"json" | "csv">("json");
  const [jsonInput, setJsonInput] = useState("");
  const [importProgress, setImportProgress] = useState<{
    total: number;
    imported: number;
    errors: string[];
  } | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    price_original: "",
    price_selling: "",
    description: "",
    images: "",
    category: "",
    source_url: "",
    tags: "",
    is_published: true,
  });

  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Lỗi khi tải dữ liệu: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/admin");
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.title || !newProduct.slug || !newProduct.price_selling) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Slug, Giá bán)");
        return;
      }

      const productData = {
        title: newProduct.title,
        slug: newProduct.slug,
        price_original: parseInt(newProduct.price_original) || parseInt(newProduct.price_selling),
        price_selling: parseInt(newProduct.price_selling),
        description: newProduct.description || null,
        images: newProduct.images ? newProduct.images.split(",").map((img) => img.trim()) : [],
        category: newProduct.category || null,
        source_url: newProduct.source_url || null,
        tags: newProduct.tags ? newProduct.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0) : [],
        is_published: newProduct.is_published,
      };

      const { error } = await supabase.from("products").insert([productData]);

      if (error) throw error;

      alert("Thêm sản phẩm thành công!");
      setShowAddProduct(false);
      setNewProduct({
        title: "",
        slug: "",
        price_original: "",
        price_selling: "",
        description: "",
        images: "",
        category: "",
        source_url: "",
        tags: "",
        is_published: true,
      });
      fetchData();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Lỗi khi thêm sản phẩm: " + (error as Error).message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      alert("Xóa sản phẩm thành công!");
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Lỗi khi xóa sản phẩm: " + (error as Error).message);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: "pending" | "done") => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      alert("Cập nhật trạng thái đơn hàng thành công!");
      fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Lỗi khi cập nhật trạng thái: " + (error as Error).message);
    }
  };

  const handleImportJSON = async () => {
    if (!jsonInput.trim()) {
      alert("Vui lòng nhập dữ liệu JSON");
      return;
    }

    try {
      // Parse JSON
      let products: any[];
      try {
        products = JSON.parse(jsonInput);
      } catch (parseError) {
        alert("Lỗi: JSON không hợp lệ. Vui lòng kiểm tra lại định dạng.");
        return;
      }

      if (!Array.isArray(products)) {
        alert("Lỗi: Dữ liệu phải là một mảng JSON");
        return;
      }

      if (products.length === 0) {
        alert("Lỗi: Mảng rỗng, không có sản phẩm nào để nhập");
        return;
      }

      // Initialize progress
      setImportProgress({ total: products.length, imported: 0, errors: [] });
      const errors: string[] = [];

      // Process each product
      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        // Validate required fields
        if (!product.title || !product.price_selling || !product.images) {
          errors.push(`Sản phẩm ${i + 1}: Thiếu thông tin bắt buộc (title, price_selling, images)`);
          setImportProgress({ total: products.length, imported: i + 1, errors: [...errors] });
          continue;
        }

        // Prepare product data
        const images = Array.isArray(product.images)
          ? product.images
          : typeof product.images === "string"
          ? product.images.split(",").map((img: string) => img.trim())
          : [];

        const tags = product.tags
          ? Array.isArray(product.tags)
            ? product.tags.map((tag: any) => String(tag).trim()).filter((tag: string) => tag.length > 0)
            : String(product.tags).split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
          : [];

        const productData = {
          title: String(product.title).trim(),
          slug: product.slug || generateSlug(product.title),
          price_original: parseInt(product.price_original) || parseInt(product.price_selling),
          price_selling: parseInt(product.price_selling),
          description: product.description ? String(product.description).trim() : null,
          images: images,
          category: product.category ? String(product.category).trim() : null,
          source_url: product.source_url ? String(product.source_url).trim() : null,
          tags: tags,
          is_published: product.is_published !== undefined ? Boolean(product.is_published) : true,
        };

        // Insert into Supabase
        try {
          const { error } = await supabase.from("products").insert([productData]);
          if (error) throw error;
        } catch (insertError: any) {
          errors.push(`Sản phẩm ${i + 1} (${product.title}): ${insertError.message}`);
        }

        setImportProgress({ total: products.length, imported: i + 1, errors: [...errors] });
      }

      // Show completion message
      const successCount = products.length - errors.length;
      if (errors.length > 0) {
        alert(
          `Nhập hoàn tất!\nThành công: ${successCount}/${products.length}\nLỗi: ${errors.length}\n\nChi tiết lỗi:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? `\n... và ${errors.length - 5} lỗi khác` : ""}`
        );
      } else {
        alert(`Nhập thành công ${successCount}/${products.length} sản phẩm!`);
      }

      // Reset and refresh
      setJsonInput("");
      setImportProgress(null);
      fetchData();
    } catch (error) {
      console.error("Error importing JSON:", error);
      alert("Lỗi khi nhập JSON: " + (error as Error).message);
      setImportProgress(null);
    }
  };

  const handleImportCSV = async (file: File) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];

        if (rows.length === 0) {
          alert("Lỗi: File CSV rỗng hoặc không có dữ liệu");
          return;
        }

        // Initialize progress
        setImportProgress({ total: rows.length, imported: 0, errors: [] });
        const errors: string[] = [];

        // Map CSV columns (case-insensitive)
        const mapColumn = (row: any, possibleNames: string[]): string | undefined => {
          for (const name of possibleNames) {
            const key = Object.keys(row).find((k) => k.toLowerCase() === name.toLowerCase());
            if (key && row[key]) return String(row[key]).trim();
          }
          return undefined;
        };

        // Process each row
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          // Map CSV fields to database columns
          const title = mapColumn(row, ["title", "tên", "name", "product"]);
          const priceSelling = mapColumn(row, ["price", "price_selling", "giá", "price_sell"]);
          const priceOriginal = mapColumn(row, ["price_original", "giá_gốc", "original_price"]);
          const imageUrl = mapColumn(row, ["image", "imageurl", "image_url", "images", "hình_ảnh", "url"]);
          const description = mapColumn(row, ["description", "mô_tả", "desc"]);
          const category = mapColumn(row, ["category", "danh_mục", "cat"]);
          const sourceUrl = mapColumn(row, ["source_url", "source", "url", "link"]);

          // Validate required fields
          if (!title || !priceSelling || !imageUrl) {
            errors.push(`Dòng ${i + 2}: Thiếu thông tin bắt buộc (Title, Price, ImageUrl)`);
            setImportProgress({ total: rows.length, imported: i + 1, errors: [...errors] });
            continue;
          }

          // Prepare product data
          const images = imageUrl.split(",").map((img: string) => img.trim()).filter((img: string) => img);

          const productData = {
            title: title,
            slug: generateSlug(title),
            price_original: priceOriginal ? parseInt(priceOriginal) : parseInt(priceSelling),
            price_selling: parseInt(priceSelling),
            description: description || null,
            images: images,
            category: category || null,
            source_url: sourceUrl || null,
            is_published: true,
          };

          // Insert into Supabase
          try {
            const { error } = await supabase.from("products").insert([productData]);
            if (error) throw error;
          } catch (insertError: any) {
            errors.push(`Dòng ${i + 2} (${title}): ${insertError.message}`);
          }

          setImportProgress({ total: rows.length, imported: i + 1, errors: [...errors] });
        }

        // Show completion message
        const successCount = rows.length - errors.length;
        if (errors.length > 0) {
          alert(
            `Nhập hoàn tất!\nThành công: ${successCount}/${rows.length}\nLỗi: ${errors.length}\n\nChi tiết lỗi:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? `\n... và ${errors.length - 5} lỗi khác` : ""}`
          );
        } else {
          alert(`Nhập thành công ${successCount}/${rows.length} sản phẩm!`);
        }

        // Reset and refresh
        setImportProgress(null);
        fetchData();
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        alert("Lỗi khi đọc file CSV: " + error.message);
        setImportProgress(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Đơn hàng ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Sản phẩm ({products.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
                Chưa có đơn hàng nào
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg border-2 p-6 ${
                    order.status === "done" ? "border-green-200 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "done"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "done" ? "Hoàn thành" : "Chờ xử lý"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {order.status !== "done" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "done")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Đánh dấu DONE
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Khách hàng</p>
                      <p className="text-gray-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Điện thoại</p>
                      <p className="text-gray-900">{order.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                      <p className="text-gray-900">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phương thức thanh toán</p>
                      <p className="text-gray-900">
                        {order.payment_method === "cod" ? "COD (Thu tiền khi giao)" : "Chuyển khoản"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tổng tiền</p>
                      <p className="text-lg font-bold text-blue-600">
                        {(order.total_price / 1000).toFixed(0)}k ₫
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Sản phẩm:</p>
                    <div className="space-y-2">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {product.title} x {product.quantity}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {(product.subtotal / 1000).toFixed(0)}k ₫
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Quản lý sản phẩm</h2>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="ten-san-pham"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá gốc (VND)
                    </label>
                    <input
                      type="number"
                      value={newProduct.price_original}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price_original: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="900000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá bán (VND) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price_selling}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price_selling: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="550000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Mô tả sản phẩm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Sweater, T-Shirt, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL nguồn
                    </label>
                    <input
                      type="text"
                      value={newProduct.source_url}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, source_url: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={newProduct.tags}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, tags: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ví dụ: quần áo, thời trang, sale</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hình ảnh (URLs, phân cách bằng dấu phẩy)
                    </label>
                    <textarea
                      value={newProduct.images}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, images: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://image1.com, https://image2.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.is_published}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, is_published: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Đã xuất bản</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Thêm sản phẩm
                  </button>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Import Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Nhập hàng loạt</h2>
                <button
                  onClick={() => setShowBulkImport(!showBulkImport)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {showBulkImport ? "Ẩn" : "Hiện"} nhập hàng loạt
                </button>
              </div>

              {showBulkImport && (
                <div className="space-y-4">
                  {/* Import Tabs */}
                  <div className="flex gap-4 border-b border-gray-200">
                    <button
                      onClick={() => setImportTab("json")}
                      className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                        importTab === "json"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Import JSON
                    </button>
                    <button
                      onClick={() => setImportTab("csv")}
                      className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                        importTab === "csv"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4 inline mr-2" />
                      Import CSV
                    </button>
                  </div>

                  {/* JSON Import */}
                  {importTab === "json" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dán JSON mảng sản phẩm
                        </label>
                        <textarea
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          rows={12}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                          placeholder={`[\n  {\n    "title": "Tên sản phẩm",\n    "price_selling": 550000,\n    "price_original": 900000,\n    "images": ["https://example.com/image.jpg"],\n    "description": "Mô tả sản phẩm",\n    "category": "Sweater"\n  }\n]`}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Yêu cầu: title, price_selling, images (mảng hoặc chuỗi phân cách bằng dấu phẩy)
                        </p>
                      </div>
                      {importProgress && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-blue-900">
                              Đang nhập: {importProgress.imported}/{importProgress.total}
                            </span>
                            <span className="text-sm text-blue-700">
                              {Math.round((importProgress.imported / importProgress.total) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(importProgress.imported / importProgress.total) * 100}%`,
                              }}
                            />
                          </div>
                          {importProgress.errors.length > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                              {importProgress.errors.length} lỗi xảy ra
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={handleImportJSON}
                        disabled={!jsonInput.trim() || (importProgress !== null && importProgress.imported < importProgress.total)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Nhập JSON
                      </button>
                    </div>
                  )}

                  {/* CSV Import */}
                  {importTab === "csv" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chọn file CSV
                        </label>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImportCSV(file);
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          CSV cần có các cột: Title (hoặc Tên), Price (hoặc Giá), ImageUrl (hoặc Image/Images), Description (tùy chọn), Category (tùy chọn)
                        </p>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs font-mono">
                          <p className="font-semibold mb-1">Ví dụ định dạng CSV:</p>
                          <pre>{`Title,Price,ImageUrl,Description,Category
Áo len,550000,https://example.com/image1.jpg,Mô tả sản phẩm,Sweater
Áo thun,350000,https://example.com/image2.jpg,Mô tả sản phẩm 2,T-Shirt`}</pre>
                        </div>
                      </div>
                      {importProgress && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-blue-900">
                              Đang nhập: {importProgress.imported}/{importProgress.total}
                            </span>
                            <span className="text-sm text-blue-700">
                              {Math.round((importProgress.imported / importProgress.total) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(importProgress.imported / importProgress.total) * 100}%`,
                              }}
                            />
                          </div>
                          {importProgress.errors.length > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                              {importProgress.errors.length} lỗi xảy ra
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {products.length === 0 ? (
                <div className="p-12 text-center text-gray-500">Chưa có sản phẩm nào</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá bán
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.id}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {product.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(product.price_selling / 1000).toFixed(0)}k ₫
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                product.is_published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.is_published ? "Đã xuất bản" : "Chưa xuất bản"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteProduct(product.id!)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

