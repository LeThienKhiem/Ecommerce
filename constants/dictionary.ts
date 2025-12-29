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
  },
};

