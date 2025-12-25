import os
import requests
import json
import random
from dotenv import load_dotenv

load_dotenv('.env.local')
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}
db_endpoint = f"{SUPABASE_URL}/rest/v1/products"

# Dữ liệu mẫu với ẢNH CHUẨN (Từ Unsplash - không bao giờ bị chặn)
# Sau này bạn thay link này bằng link Imgur của bạn
manual_products = [
    {
        "title": "Shein Oversized Distressed Knitted Sweater",
        "slug": f"shein-knitted-sweater-{random.randint(1000,9999)}",
        "price_original": 900000,
        "price_selling": 550000,
        "description": "Áo len form rộng phong cách rách tua rua. Hàng hot trend mùa thu 2024.",
        # Ảnh áo len mẫu (hoạt động 100%)
        "images": ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop"],
        "category": "Sweater",
        "source_url": "https://www.shein.com.vn/product-1",
        "is_published": True
    },
    {
        "title": "Shein FRIFUL Graphic Print Long Sleeve Tee",
        "slug": f"shein-friful-tee-{random.randint(1000,9999)}",
        "price_original": 800000,
        "price_selling": 550000,
        "description": "Áo thun dài tay in họa tiết graphic đường phố.",
        # Ảnh áo thun mẫu (hoạt động 100%)
        "images": ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1000&auto=format&fit=crop"],
        "category": "T-Shirt",
        "source_url": "https://www.shein.com.vn/product-2",
        "is_published": True
    }
]

def run_import():
    print("🚀 Đang đẩy hàng mới (Ảnh chuẩn) vào kho...")
    for product in manual_products:
        res = requests.post(db_endpoint, headers=headers, json=product)
        if res.status_code in [200, 201]:
            print(f"✅ Đã lên kệ: {product['title']}")
        else:
            print(f"❌ Lỗi: {res.text}")

if __name__ == "__main__":
    run_import()