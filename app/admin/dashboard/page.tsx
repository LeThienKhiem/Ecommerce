"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, ShoppingBag, Plus, Trash2, CheckCircle2, Upload, FileText, FileSpreadsheet, Edit2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { WholesaleContact } from "@/types/wholesale";
import { generateSlug } from "@/lib/utils";
import Papa from "papaparse";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "wholesale">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wholesaleContacts, setWholesaleContacts] = useState<WholesaleContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<string[]>([]);
  const [isRandomizing, setIsRandomizing] = useState(false);
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
    main_category: "",
    category: "",
    source_url: "",
    affiliate_link: "",
    stock: "",
    product_type: "affiliate" as "affiliate" | "direct_sale",
    sizes: "",
    tags: "",
    is_published: true,
    is_featured: true,
  });

  // Memoize fetchData to prevent infinite loops
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch distinct sub-categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);

      if (!categoriesError && categoriesData) {
        const uniqueCategories = Array.from(
          new Set(categoriesData.map((p) => p.category).filter(Boolean))
        ) as string[];
        setAllSubCategories(uniqueCategories.sort());
        // Set initial categories (will be filtered when main_category is selected)
        setCategories(uniqueCategories.sort());
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch wholesale contacts
      const { data: wholesaleData, error: wholesaleError } = await supabase
        .from("wholesale_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (wholesaleError) throw wholesaleError;
      setWholesaleContacts(wholesaleData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Lỗi khi tải dữ liệu: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array - fetchData doesn't depend on any props/state

  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin");
      return;
    }
    fetchData();
  }, [router, fetchData]);

  // Filter sub-categories based on selected main_category
  useEffect(() => {
    if (newProduct.main_category && allSubCategories.length > 0) {
      // Try to fetch sub-categories for the selected main_category
      const fetchFilteredCategories = async () => {
        const { data } = await supabase
          .from("products")
          .select("category")
          .eq("main_category", newProduct.main_category)
          .not("category", "is", null);

        if (data) {
          const filtered = Array.from(
            new Set(data.map((p) => p.category).filter(Boolean))
          ) as string[];
          // If we have filtered results, use them; otherwise show all
          setCategories(filtered.length > 0 ? filtered.sort() : [...allSubCategories]);
        }
      };
      fetchFilteredCategories();
    } else {
      // Show all sub-categories if no main_category selected
      setCategories([...allSubCategories]);
    }
  }, [newProduct.main_category, allSubCategories]); // Fixed: Added allSubCategories to dependencies

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/admin");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id!);
    // Determine product type based on affiliate_link
    const productType = product.affiliate_link ? "affiliate" : "direct_sale";
    setNewProduct({
      title: product.title,
      slug: product.slug,
      price_original: product.price_original?.toString() || "",
      price_selling: product.price_selling?.toString() || "",
      description: product.description || "",
      images: product.images?.join(", ") || "",
      main_category: (product as any).main_category || "",
      category: product.category || "",
      source_url: product.source_url || "",
      affiliate_link: product.affiliate_link || "",
      stock: product.stock?.toString() || "",
      product_type: productType,
      sizes: product.sizes?.join(", ") || "",
      tags: product.tags?.join(", ") || "",
      is_published: product.is_published ?? true,
      is_featured: product.is_featured ?? true,
    });
    setShowAddProduct(true);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setShowAddProduct(false);
      setNewProduct({
        title: "",
        slug: "",
        price_original: "",
        price_selling: "",
        description: "",
        images: "",
        main_category: "",
        category: "",
        source_url: "",
        affiliate_link: "",
        stock: "",
        product_type: "affiliate",
        sizes: "",
        tags: "",
        is_published: true,
        is_featured: true,
      });
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.title || !newProduct.slug || !newProduct.price_selling) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Slug, Giá bán)");
        return;
      }

      // Validate direct sale stock
      if (newProduct.product_type === "direct_sale" && (!newProduct.stock || parseInt(newProduct.stock) < 0)) {
        alert("Vui lòng nhập số lượng tồn kho hợp lệ cho sản phẩm bán trực tiếp");
        return;
      }

      const productData: any = {
        title: newProduct.title,
        slug: newProduct.slug,
        price_original: parseInt(newProduct.price_original) || parseInt(newProduct.price_selling),
        price_selling: parseInt(newProduct.price_selling),
        description: newProduct.description || null,
        images: newProduct.images ? newProduct.images.split(",").map((img) => img.trim()) : [],
        main_category: newProduct.main_category || null,
        category: newProduct.category || null,
        source_url: newProduct.source_url || null,
        sizes: newProduct.sizes ? newProduct.sizes.split(",").map((size) => size.trim()).filter((size) => size.length > 0) : [],
        tags: newProduct.tags ? newProduct.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0) : [],
        is_published: newProduct.is_published,
        is_featured: newProduct.is_featured,
      };

      // Handle product type logic
      if (newProduct.product_type === "affiliate") {
        productData.affiliate_link = newProduct.affiliate_link || null;
        productData.stock = 0; // Set stock to 0 for affiliate products
      } else {
        // Direct sale
        productData.affiliate_link = null; // Clear affiliate_link for direct sale
        productData.stock = parseInt(newProduct.stock) || 0;
      }

      // Set sort_order for new products (use current timestamp to appear at top)
      if (!editingProductId) {
        productData.sort_order = Date.now();
      }

      if (editingProductId) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProductId);

        if (error) throw error;
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Insert new product
        const { error } = await supabase.from("products").insert([productData]);

        if (error) throw error;
        alert("Thêm sản phẩm thành công!");
      }

      handleCancelEdit();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Lỗi khi lưu sản phẩm: " + (error as Error).message);
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

  const randomizeProductOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn sắp xếp ngẫu nhiên thứ tự sản phẩm? (Sản phẩm còn hàng sẽ ở trên, sản phẩm hết hàng sẽ ở dưới)")) {
      return;
    }

    setIsRandomizing(true);
    try {
      // Fetch all products with stock and affiliate_link to determine availability
      const { data: allProducts, error: fetchError } = await supabase
        .from("products")
        .select("id, stock, affiliate_link");

      if (fetchError) throw fetchError;

      if (!allProducts || allProducts.length === 0) {
        alert("Không có sản phẩm nào để sắp xếp");
        setIsRandomizing(false);
        return;
      }

      const currentTime = Date.now();
      
      // Generate sort_order values based on availability
      const updates = allProducts.map((product) => {
        // Determine availability:
        // Available if: (stock > 0) OR (affiliate_link is present and not empty)
        // Sold Out if: (stock <= 0 or null) AND (affiliate_link is empty/null)
        const isAvailable = 
          (product.stock !== null && product.stock !== undefined && product.stock > 0) ||
          (product.affiliate_link && product.affiliate_link.trim().length > 0);
        
        let sortOrder: number;
        
        if (isAvailable) {
          // Available items: High value range (will appear first when sorted DESC)
          // Date.now() - random(0 to 10M) ensures values are high but randomized
          sortOrder = currentTime - Math.floor(Math.random() * 10000000);
        } else {
          // Sold out items: Low value range (will appear last when sorted DESC)
          sortOrder = Math.floor(Math.random() * 1000);
        }
        
        return {
          id: product.id,
          sort_order: sortOrder,
        };
      });

      // Update products in batches to avoid overwhelming the database
      const batchSize = 50;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        
        // Use Promise.all to update batch in parallel
        await Promise.all(
          batch.map((update) =>
            supabase
              .from("products")
              .update({ sort_order: update.sort_order })
              .eq("id", update.id)
          )
        );
      }

      alert("Sắp xếp ngẫu nhiên thành công! (Sản phẩm còn hàng ở trên, hết hàng ở dưới)");
      fetchData();
    } catch (error) {
      console.error("Error randomizing product order:", error);
      alert("Lỗi khi sắp xếp ngẫu nhiên: " + (error as Error).message);
    } finally {
      setIsRandomizing(false);
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

  const handleUpdateWholesaleStatus = async (id: number, status: "open" | "closed") => {
    try {
      const { error } = await supabase
        .from("wholesale_contacts")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      alert("Cập nhật trạng thái thành công!");
      fetchData();
    } catch (error) {
      console.error("Error updating wholesale status:", error);
      alert("Lỗi khi cập nhật trạng thái: " + (error as Error).message);
    }
  };

  const handleDeleteWholesaleContact = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;

    try {
      const { error } = await supabase.from("wholesale_contacts").delete().eq("id", id);

      if (error) throw error;

      alert("Xóa liên hệ thành công!");
      fetchData();
    } catch (error) {
      console.error("Error deleting wholesale contact:", error);
      alert("Lỗi khi xóa liên hệ: " + (error as Error).message);
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

        const sizes = product.sizes
          ? Array.isArray(product.sizes)
            ? product.sizes.map((size: any) => String(size).trim()).filter((size: string) => size.length > 0)
            : String(product.sizes).split(",").map((size: string) => size.trim()).filter((size: string) => size.length > 0)
          : [];

        // Determine product type from affiliate_link
        const hasAffiliateLink = product.affiliate_link && String(product.affiliate_link).trim().length > 0;
        
        const productData: any = {
          title: String(product.title).trim(),
          slug: product.slug || generateSlug(product.title),
          price_original: parseInt(product.price_original) || parseInt(product.price_selling),
          price_selling: parseInt(product.price_selling),
          description: product.description ? String(product.description).trim() : null,
          images: images,
          main_category: product.main_category ? String(product.main_category).trim() : null,
          category: product.category ? String(product.category).trim() : null,
          source_url: product.source_url ? String(product.source_url).trim() : null,
          sizes: sizes,
          tags: tags,
          is_published: product.is_published !== undefined ? Boolean(product.is_published) : true,
          is_featured: product.is_featured !== undefined ? Boolean(product.is_featured) : true,
        };

        // Handle product type logic
        if (hasAffiliateLink) {
          productData.affiliate_link = String(product.affiliate_link).trim();
          productData.stock = 0; // Set stock to 0 for affiliate products
        } else {
          productData.affiliate_link = null;
          productData.stock = product.stock !== undefined ? parseInt(product.stock) || 0 : 0;
        }

        // Set sort_order for new products (use current timestamp to appear at top)
        productData.sort_order = Date.now();

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
          const mainCategory = mapColumn(row, ["main_category", "maincategory", "đối_tượng", "audience"]);
          const category = mapColumn(row, ["category", "danh_mục", "cat", "sub_category", "subcategory"]);
          const sourceUrl = mapColumn(row, ["source_url", "source", "url", "link"]);
          const affiliateLink = mapColumn(row, ["affiliate_link", "affiliate", "link_tiếp_thị", "affiliate_url"]);

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
            main_category: mainCategory || null,
            category: category || null,
            source_url: sourceUrl || null,
            affiliate_link: affiliateLink || null,
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
          <button
            onClick={() => setActiveTab("wholesale")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "wholesale"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Khách Sỉ (Wholesale) ({wholesaleContacts.length})
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
              <div className="flex gap-3">
                <button
                  onClick={randomizeProductOrder}
                  disabled={isRandomizing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRandomizing ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      🔀 Sắp xếp ngẫu nhiên
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm sản phẩm
                </button>
              </div>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingProductId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h3>
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
                      Đối tượng (Main Category) *
                    </label>
                    <select
                      value={newProduct.main_category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, main_category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Chọn đối tượng</option>
                      <option value="Nam">Nam (Men)</option>
                      <option value="Nữ">Nữ (Women)</option>
                      <option value="Trẻ em">Trẻ em (Kids)</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục con (Sub-Category)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="category-suggestions"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="T-Shirt, Hoodie, etc."
                      />
                      <datalist id="category-suggestions">
                        {categories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Gợi ý: {categories.slice(0, 5).join(", ")}
                      {categories.length > 5 && "..."} hoặc nhập mới
                    </p>
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
                  
                  {/* Product Type Switch */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại sản phẩm *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="product_type"
                          value="affiliate"
                          checked={newProduct.product_type === "affiliate"}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              product_type: "affiliate",
                              stock: "", // Clear stock when switching to affiliate
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Tiếp thị liên kết (Affiliate)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="product_type"
                          value="direct_sale"
                          checked={newProduct.product_type === "direct_sale"}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              product_type: "direct_sale",
                              affiliate_link: "", // Clear affiliate_link when switching to direct sale
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Bán trực tiếp (Direct Sale)</span>
                      </label>
                    </div>
                  </div>

                  {/* Conditional: Affiliate Link (only for affiliate products) */}
                  {newProduct.product_type === "affiliate" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Affiliate Link (Link Tiếp Thị) *
                      </label>
                      <input
                        type="text"
                        value={newProduct.affiliate_link}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, affiliate_link: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://shope.ee/..."
                        required={newProduct.product_type === "affiliate"}
                      />
                    </div>
                  )}

                  {/* Conditional: Stock (only for direct sale products) */}
                  {newProduct.product_type === "direct_sale" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng tồn kho (Stock) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="0"
                        required={newProduct.product_type === "direct_sale"}
                      />
                    </div>
                  )}

                  {/* Size Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kích thước / Size
                    </label>
                    <input
                      type="text"
                      value={newProduct.sizes}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sizes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="S, M, L, XL hoặc 38, 39, 40"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Phân cách các size bằng dấu phẩy
                    </p>
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
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.is_featured}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, is_featured: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Show on Home Page (Feature Product)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
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
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id!)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            </div>
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

        {/* Wholesale Tab */}
        {activeTab === "wholesale" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Quản lý khách sỉ</h2>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {wholesaleContacts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">Chưa có liên hệ khách sỉ nào</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thông tin khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Địa chỉ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tin nhắn
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
                      {wholesaleContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          className={`hover:bg-gray-50 ${
                            contact.status === "closed" ? "opacity-60" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(contact.created_at).toLocaleString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{contact.name}</div>
                            <div className="text-gray-500">{contact.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                            <div className="line-clamp-2">{contact.address}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                            <div className="line-clamp-2">{contact.message || "-"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {contact.status === "closed" ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Done
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Open
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3">
                              {contact.status === "open" && (
                                <button
                                  onClick={() => handleUpdateWholesaleStatus(contact.id, "closed")}
                                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                  title="Đánh dấu đã xử lý"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Done
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteWholesaleContact(contact.id)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            </div>
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

