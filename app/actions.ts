"use server";

import { supabase } from "@/lib/supabase";

export interface WholesaleContactData {
  name: string;
  phone: string;
  address: string;
  message: string;
}

export async function submitWholesaleContact(
  data: WholesaleContactData
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate required fields
    if (!data.name || !data.phone || !data.address) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Số điện thoại, Địa chỉ)",
      };
    }

    // Insert into wholesale_contacts table
    const { error } = await supabase.from("wholesale_contacts").insert([
      {
        name: data.name.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        message: data.message?.trim() || null,
        status: "open",
      },
    ]);

    if (error) {
      console.error("Error submitting wholesale contact:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.",
      };
    }

    return {
      success: true,
      message: "Gửi thông tin thành công! Chúng tôi sẽ liên hệ trong 24h",
    };
  } catch (error) {
    console.error("Error submitting wholesale contact:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.",
    };
  }
}



