import type { Metadata } from "next";
import Header from "@/components/Header";
import WholesaleContent from "./WholesaleContent";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://kilolook.com';
  
  return {
    title: 'Bán Sỉ Quần Áo Giá Rẻ - Kho Hàng Số Lượng Lớn & Luôn Đầy Hàng | Kilolook Wholesale',
    description: 'Tìm nguồn hàng quần áo sỉ giá rẻ tận gốc? Kilolook chuyên cung cấp sỉ thời trang số lượng lớn, hàng luôn có sẵn, chiết khấu cao. Đăng ký nhận báo giá ngay.',
    keywords: 'bán sỉ quần áo, nguồn hàng sỉ, quần áo giá rẻ, kho sỉ số lượng lớn, buôn bán quần áo',
    openGraph: {
      title: 'Bán Sỉ Quần Áo Giá Rẻ - Kho Hàng Số Lượng Lớn | Kilolook Wholesale',
      description: 'Tìm nguồn hàng quần áo sỉ giá rẻ tận gốc? Kilolook chuyên cung cấp sỉ thời trang số lượng lớn, hàng luôn có sẵn, chiết khấu cao.',
      url: `${baseUrl}/wholesale`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bán Sỉ Quần Áo Giá Rẻ - Kho Hàng Số Lượng Lớn | Kilolook Wholesale',
      description: 'Tìm nguồn hàng quần áo sỉ giá rẻ tận gốc? Kilolook chuyên cung cấp sỉ thời trang số lượng lớn, hàng luôn có sẵn, chiết khấu cao.',
    },
  };
}

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WholesaleContent />
    </div>
  );
}
