import os
import json
import requests
from dotenv import load_dotenv

# 1. Tự động đọc chìa khóa từ file .env.local
load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# Kiểm tra xem có đọc được không
if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Lỗi: Bot không tìm thấy chìa khóa trong file .env.local")
    print("👉 Bạn hãy mở file .env.local ra kiểm tra lại xem đã lưu chưa (Ctrl+S).")
    exit()

print(f"✅ Đã nhận diện kho hàng: {SUPABASE_URL}")

# 2. Cấu hình gửi hàng (Header)
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

api_endpoint = f"{SUPABASE_URL}/rest/v1/products"

# 3. Danh sách hàng mẫu (Giả lập)
dummy_products = [
    {
        "title": "Cyberpunk Neon Bomber Jacket",
        "slug": "cyberpunk-neon-bomber-jacket",
        "price_original": 1200000,
        "price_selling": 2500000,
        "description": "Áo khoác phong cách tương lai với đèn LED tích hợp. Chống nước, bao ngầu.",
        "images": ["https://images.unsplash.com/photo-1551488852-7a304bef7959?q=80&w=1000&auto=format&fit=crop"],
        "category": "Techwear",
        "source_url": "https://shein.com/sample-1",
        "is_published": True
    },
    {
        "title": "Hacker Black Hoodie - Oversized",
        "slug": "hacker-black-hoodie",
        "price_original": 500000,
        "price_selling": 1200000,
        "description": "Hoodie đen trơn form rộng. Trang bị tối thượng cho những đêm code xuyên màn đêm.",
        "images": ["https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1000&auto=format&fit=crop"],
        "category": "Hoodie",
        "source_url": "https://temu.com/sample-2",
        "is_published": True
    },
    {
        "title": "Mech Warrior Cargo Pants",
        "slug": "mech-warrior-cargo-pants",
        "price_original": 800000,
        "price_selling": 1900000,
        "description": "Quần túi hộp đa năng phong cách quân đội viễn tưởng.",
        "images": ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop"],
        "category": "Pants",
        "source_url": "https://shein.com/sample-3",
        "is_published": True
    }
]

# 4. Bắn hàng vào kho
def push_to_db():
    print("🚀 Đang vận chuyển hàng vào kho...")
    
    for product in dummy_products:
        # Kiểm tra trùng hàng
        check_url = f"{api_endpoint}?slug=eq.{product['slug']}&select=id"
        response = requests.get(check_url, headers=headers)
        
        if response.status_code == 200 and len(response.json()) > 0:
            print(f"⚠️ Hàng đã có sẵn: {product['title']}")
        else:
            # Thêm mới
            post_response = requests.post(api_endpoint, headers=headers, json=product)
            if post_response.status_code in [200, 201]:
                print(f"✨ Nhập kho thành công: {product['title']}")
            else:
                print(f"❌ Lỗi nhập kho: {post_response.text}")

if __name__ == "__main__":
    push_to_db()