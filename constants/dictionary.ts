export type Language = 'vi' | 'en';

export interface Dictionary {
  home: string;
  products: string;
  wholesale: string;
  contact: string;
  about: string;
  buy_now: string;
  add_to_cart: string;
  admin_panel: string;
  search: string;
  cart: string;
  checkout: string;
  featured_products: string;
  all_products: string;
  categories: string;
  men: string;
  women: string;
  kids: string;
  unisex: string;
  all: string;
  description: string;
  price: string;
  tags: string;
  shipping_info: string;
  product_info: string;
  category: string;
  product_code: string;
  back_to_products: string;
  payment: string;
  back_to_home: string;
  wholesale_title: string;
  wholesale_description: string;
  wholesale_form_name: string;
  wholesale_form_phone: string;
  wholesale_form_address: string;
  wholesale_form_message: string;
  wholesale_form_title: string;
  wholesale_submit: string;
  wholesale_success: string;
  name: string;
  phone: string;
  address: string;
  message: string;
  submit: string;
  required: string;
  optional: string;
  about_title: string;
  about_content_1: string;
  about_content_2: string;
  about_content_3: string;
  contact_title: string;
  contact_get_in_touch: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_send_message: string;
  contact_form_name: string;
  contact_form_email: string;
  contact_form_message: string;
  contact_send_button: string;
  contact_shop_email: string;
  contact_shop_phone: string;
  contact_shop_address: string;
  // Home page
  home_hero_title: string;
  home_hero_subtitle: string;
  home_no_products: string;
  home_search_results: string;
  home_no_search_results: string;
  home_clear_search: string;
  home_footer_store: string;
  home_footer_tagline: string;
  home_footer_shop: string;
  home_footer_featured: string;
  home_footer_company: string;
  home_footer_legal: string;
  home_footer_privacy: string;
  home_footer_terms: string;
  home_footer_rights: string;
  // Wholesale page
  wholesale_hero_title: string;
  wholesale_hero_subtitle: string;
  wholesale_hero_cta: string;
  wholesale_feature_price_title: string;
  wholesale_feature_price_desc: string;
  wholesale_feature_stock_title: string;
  wholesale_feature_stock_desc: string;
  wholesale_feature_images_title: string;
  wholesale_feature_images_desc: string;
  wholesale_feature_shipping_title: string;
  wholesale_feature_shipping_desc: string;
  wholesale_seo_title: string;
  wholesale_seo_content_1: string;
  wholesale_seo_content_2: string;
  wholesale_seo_content_3: string;
  wholesale_cta_title: string;
  wholesale_cta_subtitle: string;
  wholesale_cta_button: string;
  // Product page
  product_back_to_products: string;
  product_save: string;
  product_shipping_time: string;
  product_description_label: string;
  product_info: string;
  product_category_label: string;
  product_code_label: string;
  product_stock_label: string;
  product_items: string;
  product_out_of_stock: string;
  product_buy_on_shopee: string;
  // Products listing page
  products_all_products: string;
  products_found: string;
  products_in_category: string;
  products_no_products: string;
}

export const dictionary: Record<Language, Dictionary> = {
  vi: {
    home: 'Trang Chủ',
    products: 'Sản Phẩm',
    wholesale: 'Khách Sỉ',
    contact: 'Liên Hệ',
    about: 'Giới Thiệu',
    buy_now: 'Mua Ngay',
    add_to_cart: 'Thêm Vào Giỏ',
    admin_panel: 'Quản Trị',
    search: 'Tìm kiếm',
    cart: 'Giỏ Hàng',
    checkout: 'Thanh Toán',
    featured_products: 'Sản Phẩm Nổi Bật',
    all_products: 'Tất Cả Sản Phẩm',
    categories: 'Danh Mục',
    men: 'Nam',
    women: 'Nữ',
    kids: 'Trẻ em',
    unisex: 'Unisex',
    all: 'Tất cả',
    description: 'Mô Tả',
    price: 'Giá',
    tags: 'Tags',
    shipping_info: 'Thông tin giao hàng',
    product_info: 'Thông Tin Sản Phẩm',
    category: 'Danh Mục',
    product_code: 'Mã Sản Phẩm',
    back_to_products: 'Quay Lại Sản Phẩm',
    payment: 'Thanh Toán',
    back_to_home: 'Quay Lại Trang Chủ',
    wholesale_title: 'Đăng Ký Khách Sỉ',
    wholesale_description: 'Điền thông tin bên dưới để đăng ký làm khách sỉ. Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.',
    wholesale_form_name: 'Họ và Tên',
    wholesale_form_phone: 'Số Điện Thoại',
    wholesale_form_address: 'Địa Chỉ',
    wholesale_form_message: 'Tin Nhắn',
    wholesale_form_title: 'Đăng Ký Nhận Báo Giá Sỉ',
    wholesale_submit: 'Gửi Thông Tin',
    wholesale_success: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ trong 24h',
    name: 'Họ và Tên',
    phone: 'Số Điện Thoại',
    address: 'Địa Chỉ',
    message: 'Tin Nhắn',
    submit: 'Gửi',
    required: 'Bắt buộc',
    optional: 'Tùy chọn',
    about_title: 'Giới Thiệu',
    about_content_1: 'Chào mừng đến với cửa hàng thương mại điện tử hiện đại và tối giản của chúng tôi. Chúng tôi tin vào sự đơn giản, chất lượng và trải nghiệm khách hàng tuyệt vời.',
    about_content_2: 'Sứ mệnh của chúng tôi là tuyển chọn một bộ sưu tập sản phẩm kết hợp giữa hình thức và chức năng, mang đến cho bạn những sản phẩm nâng cao cuộc sống hàng ngày trong khi duy trì một thẩm mỹ sạch sẽ, không lộn xộn.',
    about_content_3: 'Mỗi sản phẩm trong cửa hàng của chúng tôi đã được lựa chọn cẩn thận về chất lượng, thiết kế và giá trị. Chúng tôi phấn đấu mang đến trải nghiệm mua sắm liền mạch từ khám phá đến giao hàng.',
    contact_title: 'Liên Hệ',
    contact_get_in_touch: 'Liên Hệ Với Chúng Tôi',
    contact_email: 'Email',
    contact_phone: 'Điện Thoại',
    contact_address: 'Địa Chỉ',
    contact_send_message: 'Gửi Tin Nhắn',
    contact_form_name: 'Họ và Tên',
    contact_form_email: 'Email',
    contact_form_message: 'Tin Nhắn',
    contact_send_button: 'Gửi Tin Nhắn',
    contact_shop_email: 'info@kilolook.com',
    contact_shop_phone: '0123 456 789',
    contact_shop_address: '123 Đường Thương Mại, Quận 1, TP. Hồ Chí Minh, Việt Nam',
    // Home page
    home_hero_title: 'Khám Phá Phong Cách Của Bạn',
    home_hero_subtitle: 'Sản phẩm được tuyển chọn dành cho phong cách sống của bạn',
    home_no_products: 'Hiện tại không có sản phẩm nào.',
    home_search_results: 'Kết quả tìm kiếm cho',
    home_no_search_results: 'Không tìm thấy sản phẩm nào khớp với',
    home_clear_search: 'Xóa tìm kiếm và xem tất cả sản phẩm',
    home_footer_store: 'Kilolook Store',
    home_footer_tagline: 'Trải nghiệm thương mại điện tử hiện đại',
    home_footer_shop: 'Cửa Hàng',
    home_footer_featured: 'Nổi Bật',
    home_footer_company: 'Công Ty',
    home_footer_legal: 'Pháp Lý',
    home_footer_privacy: 'Chính Sách Bảo Mật',
    home_footer_terms: 'Điều Khoản Dịch Vụ',
    home_footer_rights: 'Bảo lưu mọi quyền.',
    // Wholesale page
    wholesale_hero_title: 'Kho Sỉ Quần Áo Lớn Nhất - Giá Rẻ Tận Gốc',
    wholesale_hero_subtitle: 'Nguồn hàng ổn định - Số lượng lớn - Luôn đầy hàng',
    wholesale_hero_cta: 'Liên Hệ Nhập Sỉ Ngay',
    wholesale_feature_price_title: 'Giá Rẻ Nhất',
    wholesale_feature_price_desc: 'Giá sỉ tận gốc, không qua trung gian, chiết khấu cao cho đơn hàng số lượng lớn',
    wholesale_feature_stock_title: 'Sẵn Hàng Số Lượng Lớn',
    wholesale_feature_stock_desc: 'Kho hàng luôn đầy đủ, đáp ứng mọi nhu cầu nhập sỉ với số lượng lớn',
    wholesale_feature_images_title: 'Hỗ Trợ Hình Ảnh',
    wholesale_feature_images_desc: 'Cung cấp đầy đủ hình ảnh sản phẩm chất lượng cao để hỗ trợ bán hàng',
    wholesale_feature_shipping_title: 'Giao Hàng Toàn Quốc',
    wholesale_feature_shipping_desc: 'Vận chuyển nhanh chóng, an toàn đến mọi tỉnh thành trên cả nước',
    wholesale_seo_title: 'Tại Sao Nên Chọn Kilolook Làm Đối Tác Bán Sỉ?',
    wholesale_seo_content_1: 'Kilolook tự hào là nguồn hàng sỉ quần áo uy tín hàng đầu, chuyên cung cấp quần áo giá rẻ tận gốc cho các đối tác kinh doanh trên toàn quốc. Với nhiều năm kinh nghiệm trong lĩnh vực bán sỉ quần áo, chúng tôi cam kết mang đến cho bạn những sản phẩm chất lượng với mức giá cạnh tranh nhất thị trường.',
    wholesale_seo_content_2: 'Điểm mạnh của Kilolook là nguồn hàng ổn định, không qua trung gian, giúp bạn có được mức giá tốt nhất. Chúng tôi sở hữu kho sỉ số lượng lớn với hàng nghìn sản phẩm luôn có sẵn, đáp ứng mọi nhu cầu buôn bán quần áo của bạn. Từ áo thun, quần jean, váy đầm đến các phụ kiện thời trang, tất cả đều được tuyển chọn kỹ lưỡng để đảm bảo chất lượng và xu hướng thời trang mới nhất.',
    wholesale_seo_content_3: 'Khi hợp tác với Kilolook, bạn sẽ nhận được nhiều ưu đãi đặc biệt: chiết khấu cao cho đơn hàng số lượng lớn, hỗ trợ hình ảnh sản phẩm chất lượng, giao hàng nhanh chóng toàn quốc, và đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn 24/7. Chúng tôi hiểu rằng thành công của bạn chính là thành công của chúng tôi, vì vậy chúng tôi luôn nỗ lực để trở thành đối tác đáng tin cậy nhất trong hành trình kinh doanh của bạn.',
    wholesale_cta_title: 'Sẵn Sàng Bắt Đầu Kinh Doanh?',
    wholesale_cta_subtitle: 'Đăng ký ngay để nhận báo giá sỉ tốt nhất và trở thành đối tác của chúng tôi',
    wholesale_cta_button: 'Đăng Ký Nhận Báo Giá Ngay',
    // Product page
    product_back_to_products: 'Quay Lại Sản Phẩm',
    product_save: 'Tiết kiệm',
    product_shipping_time: '🚚 Thời gian giao hàng dự kiến: 7 - 10 ngày',
    product_description_label: 'Mô Tả',
    product_info: 'Thông Tin Sản Phẩm',
    product_category_label: 'Danh Mục',
    product_code_label: 'Mã Sản Phẩm',
    product_stock_label: 'Số lượng tồn kho',
    product_items: 'sản phẩm',
    product_out_of_stock: 'Hết hàng',
    product_buy_on_shopee: 'Mua ngay trên Shopee',
    // Products listing page
    products_all_products: 'Tất Cả Sản Phẩm',
    products_found: 'Tìm thấy',
    products_in_category: 'trong danh mục',
    products_no_products: 'Hiện tại không có sản phẩm nào.',
  },
  en: {
    home: 'Home',
    products: 'Products',
    wholesale: 'Wholesale',
    contact: 'Contact',
    about: 'About',
    buy_now: 'Buy Now',
    add_to_cart: 'Add to Cart',
    admin_panel: 'Admin',
    search: 'Search',
    cart: 'Cart',
    checkout: 'Checkout',
    featured_products: 'Featured Products',
    all_products: 'All Products',
    categories: 'Categories',
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    unisex: 'Unisex',
    all: 'All',
    description: 'Description',
    price: 'Price',
    tags: 'Tags',
    shipping_info: 'Shipping Info',
    product_info: 'Product Information',
    category: 'Category',
    product_code: 'Product Code',
    back_to_products: 'Back to Products',
    payment: 'Payment',
    back_to_home: 'Back to Home',
    wholesale_title: 'Wholesale Registration',
    wholesale_description: 'Fill in the information below to register as a wholesale customer. We will contact you within 24 hours.',
    wholesale_form_name: 'Full Name',
    wholesale_form_phone: 'Phone Number',
    wholesale_form_address: 'Address',
    wholesale_form_message: 'Message',
    wholesale_form_title: 'Register for Wholesale Quote',
    wholesale_submit: 'Submit Information',
    wholesale_success: 'Information submitted successfully! We will contact you within 24 hours',
    name: 'Full Name',
    phone: 'Phone Number',
    address: 'Address',
    message: 'Message',
    submit: 'Submit',
    required: 'Required',
    optional: 'Optional',
    about_title: 'About Us',
    about_content_1: 'Welcome to our modern, minimalist e-commerce store. We believe in simplicity, quality, and exceptional customer experience.',
    about_content_2: 'Our mission is to curate a collection of products that combine form and function, bringing you items that enhance your daily life while maintaining a clean, uncluttered aesthetic.',
    about_content_3: 'Every product in our store has been carefully selected for its quality, design, and value. We strive to offer a seamless shopping experience from discovery to delivery.',
    contact_title: 'Contact Us',
    contact_get_in_touch: 'Get in Touch',
    contact_email: 'Email',
    contact_phone: 'Phone',
    contact_address: 'Address',
    contact_send_message: 'Send a Message',
    contact_form_name: 'Name',
    contact_form_email: 'Email',
    contact_form_message: 'Message',
    contact_send_button: 'Send Message',
    contact_shop_email: 'info@kilolook.com',
    contact_shop_phone: '+84 123 456 789',
    contact_shop_address: '123 Commerce Street, District 1, Ho Chi Minh City, Vietnam',
    // Home page
    home_hero_title: 'Discover Your Style',
    home_hero_subtitle: 'Curated products for your lifestyle',
    home_no_products: 'No products available at the moment.',
    home_search_results: 'Search results for',
    home_no_search_results: 'No products found matching',
    home_clear_search: 'Clear search and view all products',
    home_footer_store: 'Kilolook Store',
    home_footer_tagline: 'Modern e-commerce experience',
    home_footer_shop: 'Shop',
    home_footer_featured: 'Featured',
    home_footer_company: 'Company',
    home_footer_legal: 'Legal',
    home_footer_privacy: 'Privacy Policy',
    home_footer_terms: 'Terms of Service',
    home_footer_rights: 'All rights reserved.',
    // Wholesale page
    wholesale_hero_title: 'Largest Wholesale Clothing Warehouse - Best Prices',
    wholesale_hero_subtitle: 'Stable supply - Large quantities - Always in stock',
    wholesale_hero_cta: 'Contact for Wholesale Now',
    wholesale_feature_price_title: 'Best Prices',
    wholesale_feature_price_desc: 'Direct wholesale prices, no middlemen, high discounts for large orders',
    wholesale_feature_stock_title: 'Large Stock Available',
    wholesale_feature_stock_desc: 'Warehouse always fully stocked, meeting all wholesale needs in large quantities',
    wholesale_feature_images_title: 'Image Support',
    wholesale_feature_images_desc: 'Provide high-quality product images to support sales',
    wholesale_feature_shipping_title: 'Nationwide Shipping',
    wholesale_feature_shipping_desc: 'Fast and safe shipping to all provinces across the country',
    wholesale_seo_title: 'Why Choose Kilolook as Your Wholesale Partner?',
    wholesale_seo_content_1: 'Kilolook is proud to be a leading trusted wholesale clothing supplier, specializing in providing direct wholesale prices for business partners nationwide. With years of experience in wholesale clothing, we are committed to bringing you quality products at the most competitive market prices.',
    wholesale_seo_content_2: 'Kilolook\'s strength is stable supply, no middlemen, helping you get the best prices. We own a large wholesale warehouse with thousands of products always available, meeting all your wholesale clothing needs. From t-shirts, jeans, dresses to fashion accessories, all are carefully selected to ensure quality and the latest fashion trends.',
    wholesale_seo_content_3: 'When partnering with Kilolook, you will receive many special benefits: high discounts for large orders, quality product image support, fast nationwide shipping, and a professional consulting team always ready to support you 24/7. We understand that your success is our success, so we always strive to be the most reliable partner in your business journey.',
    wholesale_cta_title: 'Ready to Start Your Business?',
    wholesale_cta_subtitle: 'Register now to receive the best wholesale prices and become our partner',
    wholesale_cta_button: 'Register for Wholesale Quote Now',
    // Product page
    product_back_to_products: 'Back to Products',
    product_save: 'Save',
    product_shipping_time: '🚚 Estimated delivery time: 7 - 10 days',
    product_description_label: 'Description',
    product_info: 'Product Information',
    product_category_label: 'Category',
    product_code_label: 'Product Code',
    product_stock_label: 'Stock Quantity',
    product_items: 'items',
    product_out_of_stock: 'Out of Stock',
    product_buy_on_shopee: 'Buy Now on Shopee',
    // Products listing page
    products_all_products: 'All Products',
    products_found: 'Found',
    products_in_category: 'in category',
    products_no_products: 'No products available at the moment.',
  },
};

