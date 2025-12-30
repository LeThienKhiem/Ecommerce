"use server";

import { supabase } from "@/lib/supabase";
import { ProductTranslation } from "@/types/product";

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

/**
 * Auto-translate product content to all supported languages
 * This is a placeholder function. Replace with actual translation API (OpenAI, Google Translate, etc.)
 */
export async function autoTranslateProduct(
  vietnameseName: string,
  vietnameseDescription: string,
  vietnameseSlug: string
): Promise<Record<string, ProductTranslation>> {
  // TODO: Replace this with actual translation API
  // For now, this is a placeholder that generates mock translations
  // You can integrate OpenAI, Google Translate API, or other services here

  const translations: Record<string, ProductTranslation> = {};

  // English translation (placeholder - append [EN] for testing)
  translations.en = {
    name: vietnameseName ? `${vietnameseName} [EN]` : "",
    description: vietnameseDescription ? `${vietnameseDescription} [EN]` : "",
    slug: vietnameseSlug ? `${vietnameseSlug}-en` : "",
  };

  // Indonesian translation (placeholder)
  translations.id = {
    name: vietnameseName ? `${vietnameseName} [ID]` : "",
    description: vietnameseDescription ? `${vietnameseDescription} [ID]` : "",
    slug: vietnameseSlug ? `${vietnameseSlug}-id` : "",
  };

  // Filipino translation (placeholder)
  translations.fil = {
    name: vietnameseName ? `${vietnameseName} [FIL]` : "",
    description: vietnameseDescription ? `${vietnameseDescription} [FIL]` : "",
    slug: vietnameseSlug ? `${vietnameseSlug}-fil` : "",
  };

  // Khmer translation (placeholder)
  translations.km = {
    name: vietnameseName ? `${vietnameseName} [KM]` : "",
    description: vietnameseDescription ? `${vietnameseDescription} [KM]` : "",
    slug: vietnameseSlug ? `${vietnameseSlug}-km` : "",
  };

  // Example: If you want to use OpenAI API, uncomment and configure:
  /*
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const languages = ['en', 'id', 'fil', 'km'];
  for (const lang of languages) {
    const nameResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `Translate the following Vietnamese product name to ${lang === 'en' ? 'English' : lang === 'id' ? 'Indonesian' : lang === 'fil' ? 'Filipino' : 'Khmer'}. Return only the translation, no explanations.` },
        { role: "user", content: vietnameseName }
      ],
    });
    
    const descResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `Translate the following Vietnamese product description to ${lang === 'en' ? 'English' : lang === 'id' ? 'Indonesian' : lang === 'fil' ? 'Filipino' : 'Khmer'}. Return only the translation, no explanations.` },
        { role: "user", content: vietnameseDescription }
      ],
    });
    
    translations[lang] = {
      name: nameResponse.choices[0].message.content || "",
      description: descResponse.choices[0].message.content || "",
      slug: vietnameseSlug ? `${vietnameseSlug}-${lang}` : "",
    };
  }
  */

  return translations;
}

