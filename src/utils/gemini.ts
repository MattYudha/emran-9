import axios from "axios";

// Environment variable for Gemini API Key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Base URL for the Gemini API
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Comprehensive and structured company profile data for PT. EMRAN GHANIM ASAHI
const companyProfile = {
  about: `PT. EMRAN GHANIM ASAHI, established on **April 3, 2023**, is a leading provider of **printing and labeling services** based in Tangerang, Banten. Our vision is to become a global leader by delivering **high-quality, innovative solutions** for the retail, fashion, and logistics sectors, backed by state-of-the-art equipment and a dedicated professional team.`,
  services: `We offer a comprehensive range of products including **UPC labels, stickers, custom books, calendars, brochures, polybags, barcode labels, hangtags, size labels, care labels, inboxes, screen printing services, custom ribbons, and personalized stationery**. Our solutions cater to diverse industry needs with premium quality materials and advanced printing technology.`,
  contact: `You can reach us at **The Avenue Block Z 06/36, Citra Raya, Cikupa, Tangerang**. For inquiries, email us at **sales@emranghanimasahi.net** or call us at **(021) 89088260**. You can also directly contact **Mr. Darmawan at 0813-9831-8839** for immediate assistance.`,
  partners: `We proudly collaborate with esteemed partners such as **PT. UNIMITRA KHARISMA, PT. HWA SEUNG INDONESIA, and PT. SMART MULTI FINANCE**, enabling us to undertake and successfully deliver large-scale projects with guaranteed quality and timely delivery.`,
  equipment: `Our production capabilities are supported by advanced machinery, including **cutting machines (17,500 units/day), offset printers (49,000 units/day), and sealing machines (35,000 units/day)**, ensuring high-quality output and efficient production that meets international standards.`,
  legal: `PT. EMRAN GHANIM ASAHI operates under full compliance with Indonesian regulations, possessing a valid **Akta Pendirian (Deed of Establishment), NPWP (Taxpayer Identification Number), and NIB (Business Identification Number)**, ensuring complete legal compliance and business transparency.`,
  whyChooseUs: `Choose PT. EMRAN GHANIM ASAHI for **superior quality printing, timely delivery, competitive pricing, and professional service** tailored for the retail, fashion, and logistics industries. We are committed to exceeding your expectations with every project through innovation and excellence.`,
  generalInquiry: `I'm Emran Chatbot, your dedicated assistant for PT. EMRAN GHANIM ASAHI's **printing and labeling services**. I'm here to help you with information about our products, services, pricing, and company details. Please feel free to ask me anything!`,
  pricing: `We offer competitive pricing with flexible payment terms. Our rates vary based on quantity, materials, and finishing options. Contact us for a detailed quote tailored to your specific requirements. We also provide bulk discounts for large orders.`,
  quality: `Quality is our top priority. We use premium materials, advanced printing technology, and strict quality control processes. All our products undergo thorough inspection before delivery to ensure they meet the highest standards.`,
  turnaround: `Our standard turnaround time is 3-7 business days depending on the complexity and quantity of your order. We also offer rush services for urgent projects with same-day or next-day delivery options available.`,
  imageAnalysis: `Based on the image you've shared, I can provide specific recommendations for our printing services. Our team specializes in analyzing design requirements and suggesting the best printing solutions for your needs.`
};

// Utility function to introduce a delay, useful for handling API rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interface for the expected structure of the Gemini API response
interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
  error?: {
    code: number;
    message: string;
    status: string;
    details?: any[];
  };
}

/**
 * Enhanced chatbot response generator with image recognition capabilities.
 * Supports both text and image inputs for comprehensive customer assistance.
 *
 * @param message The user's input message.
 * @param language The desired language for the response (e.g., 'en', 'id'). Defaults to 'en'.
 * @param imageBase64 Optional base64 encoded image data for analysis.
 * @param imageMimeType Optional MIME type of the image (e.g., 'image/jpeg', 'image/png').
 * @param retries The number of retries for API calls in case of rate limiting. Defaults to 3.
 * @returns A promise that resolves to the chatbot's response string.
 * @throws Error if the Gemini API key is not configured or if other unrecoverable API errors occur.
 */
export async function getChatbotResponse(
  message: string,
  language: string = "en",
  imageBase64?: string,
  imageMimeType?: string,
  retries: number = 3
): Promise<string> {
  // Validate API key first
  if (!GEMINI_API_KEY) {
    const errorMsg = language === "id" 
      ? "Konfigurasi API tidak tersedia. Silakan hubungi administrator sistem."
      : "API configuration is not available. Please contact the system administrator.";
    throw new Error(errorMsg);
  }

  // Map language codes to full language names for prompt generation
  const languageMap: { [key: string]: string } = {
    en: "English",
    id: "Indonesian",
    ja: "Japanese",
    zh: "Chinese",
    ar: "Arabic",
  };
  const languageInstruction = languageMap[language] || "English";

  // Normalize message for keyword matching
  const lowerMessage = message.toLowerCase();

  // Enhanced keyword-based responses for company profile (only for text-only queries)
  if (!imageBase64) {
    if (
      lowerMessage.includes("company profile") ||
      lowerMessage.includes("tentang perusahaan") ||
      lowerMessage.includes("about us") ||
      lowerMessage.includes("profil perusahaan") ||
      lowerMessage.includes("what is pt emran ghanim asahi") ||
      lowerMessage.includes("about your company")
    ) {
      return companyProfile.about;
    }
    
    if (
      lowerMessage.includes("services") ||
      lowerMessage.includes("layanan") ||
      lowerMessage.includes("produk") ||
      lowerMessage.includes("what do you offer") ||
      lowerMessage.includes("products") ||
      lowerMessage.includes("printing services")
    ) {
      return companyProfile.services;
    }
    
    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("kontak") ||
      lowerMessage.includes("hubungi") ||
      lowerMessage.includes("get in touch") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("email")
    ) {
      return companyProfile.contact;
    }
    
    if (
      lowerMessage.includes("partners") ||
      lowerMessage.includes("mitra") ||
      lowerMessage.includes("klien") ||
      lowerMessage.includes("who do you work with") ||
      lowerMessage.includes("clients")
    ) {
      return companyProfile.partners;
    }
    
    if (
      lowerMessage.includes("equipment") ||
      lowerMessage.includes("mesin") ||
      lowerMessage.includes("peralatan") ||
      lowerMessage.includes("machinery") ||
      lowerMessage.includes("production capacity") ||
      lowerMessage.includes("capabilities")
    ) {
      return companyProfile.equipment;
    }
    
    if (
      lowerMessage.includes("legal") ||
      lowerMessage.includes("legalitas") ||
      lowerMessage.includes("izin") ||
      lowerMessage.includes("licenses") ||
      lowerMessage.includes("compliance")
    ) {
      return companyProfile.legal;
    }
    
    if (
      lowerMessage.includes("why choose") ||
      lowerMessage.includes("kenapa memilih") ||
      lowerMessage.includes("benefits") ||
      lowerMessage.includes("advantages") ||
      lowerMessage.includes("why should")
    ) {
      return companyProfile.whyChooseUs;
    }
    
    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("harga") ||
      lowerMessage.includes("biaya") ||
      lowerMessage.includes("quote") ||
      lowerMessage.includes("pricing")
    ) {
      return companyProfile.pricing;
    }
    
    if (
      lowerMessage.includes("quality") ||
      lowerMessage.includes("kualitas") ||
      lowerMessage.includes("standard") ||
      lowerMessage.includes("guarantee")
    ) {
      return companyProfile.quality;
    }
    
    if (
      lowerMessage.includes("turnaround") ||
      lowerMessage.includes("delivery") ||
      lowerMessage.includes("waktu") ||
      lowerMessage.includes("pengiriman") ||
      lowerMessage.includes("how long") ||
      lowerMessage.includes("berapa lama")
    ) {
      return companyProfile.turnaround;
    }
    
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hallo") ||
      lowerMessage.includes("hai") ||
      lowerMessage.includes("good morning") ||
      lowerMessage.includes("good afternoon") ||
      lowerMessage.includes("selamat")
    ) {
      return companyProfile.generalInquiry;
    }
  }

  try {
    console.log(
      `Attempting to get response from Gemini API: ${new Date().toISOString()}`
    );

    // Construct parts array for the API request
    const parts: any[] = [];

    // Enhanced prompt for image analysis or text-only interaction
    const basePrompt = `You are Emran Chatbot, the official AI assistant for PT. EMRAN GHANIM ASAHI, a premium printing and labeling company established in 2023 in Tangerang, Banten, Indonesia.

**Your Identity:**
- Name: Emran Chatbot
- Role: Virtual Assistant for PT. EMRAN GHANIM ASAHI
- Personality: Professional, helpful, knowledgeable, and customer-focused

**Company Profile Summary:**
PT. EMRAN GHANIM ASAHI specializes in high-quality printing and labeling solutions for retail, fashion, and logistics industries. We offer UPC labels, stickers, books, calendars, brochures, polybags, barcode labels, hangtags, size labels, care labels, inboxes, screen printing, custom ribbons, and personalized stationery.

**Key Information:**
- **Established:** April 3, 2023
- **Location:** The Avenue Block Z 06/36, Citra Raya, Cikupa, Tangerang
- **Contact:** Email: sales@emranghanimasahi.net | Phone: (021) 89088260 | Direct: Mr. Darmawan at 0813-9831-8839
- **Partners:** PT. UNIMITRA KHARISMA, PT. HWA SEUNG INDONESIA, PT. SMART MULTI FINANCE
- **Production Capacity:** Cutting machines (17,500 units/day), Offset printers (49,000 units/day), Sealing machines (35,000 units/day)

**Response Guidelines:**
1. **Language:** Respond strictly in ${languageInstruction}
2. **Length:** Keep responses under 60 words, focusing on direct and helpful information
3. **Tone:** Maintain a professional, friendly, and customer-service oriented tone
4. **Relevance:** Prioritize information about PT. EMRAN GHANIM ASAHI's services, capabilities, and business solutions
5. **Accuracy:** Only provide information that is factual and based on the company profile
6. **Redirection:** For unrelated queries, politely redirect to company services
7. **Call-to-Action:** When appropriate, encourage users to contact us for quotes or consultations`;

    // Add image data if provided
    if (imageBase64 && imageMimeType) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64
        }
      });
    }

    // Add specific instructions for image analysis
    if (imageBase64 && imageMimeType) {
      parts.push({
        text: `${basePrompt}

**Image Analysis Instructions:**
- Analyze the provided image in the context of printing and labeling services
- Identify potential printing needs, design elements, or product types visible in the image
- Suggest relevant PT. EMRAN GHANIM ASAHI services based on what you see
- If the image shows printed materials, comment on quality, design, or potential improvements
- If the image is unclear or unrelated to printing, provide a helpful response about our general services
- Always relate your analysis back to how we can help with their printing needs

**User Query:** ${message}

Please analyze the image and provide a helpful response about how PT. EMRAN GHANIM ASAHI can assist with their printing needs.`
      });
    } else {
      parts.push({
        text: `${basePrompt}

**User Query:** ${message}

Please provide a helpful, accurate response that represents PT. EMRAN GHANIM ASAHI professionally.`
      });
    }

    // Enhanced Gemini API Request
    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.4,
          topP: 0.8,
          topK: 40,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 second timeout for image processing
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.warn("Gemini API returned an empty or invalid response.");
      const fallbackMsg = language === "id"
        ? "Maaf, saya tidak dapat memberikan respons yang jelas saat ini. Silakan hubungi kami langsung di (021) 89088260 untuk bantuan lebih lanjut."
        : "I apologize, but I couldn't generate a clear response at this moment. Please contact us directly at (021) 89088260 for further assistance.";
      return fallbackMsg;
    }

    return reply.trim();
  } catch (error: any) {
    console.error(
      "Error getting Gemini response:",
      error.response?.data || error.message
    );

    // Enhanced error handling with retries
    if (error.response?.status === 429 && retries > 0) {
      console.log(
        `Rate limit hit. Retrying in 2 seconds. Attempts left: ${retries - 1}`
      );
      await delay(2000);
      return getChatbotResponse(message, language, imageBase64, imageMimeType, retries - 1);
    }

    // More specific error messages for better user experience
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = "";
      
      switch (status) {
        case 400:
          errorMessage = language === "id"
            ? "Permintaan tidak valid. Silakan coba dengan pertanyaan yang berbeda."
            : "Invalid request. Please try with a different question.";
          break;
        case 401:
        case 403:
          errorMessage = language === "id"
            ? "Terjadi masalah autentikasi. Silakan hubungi dukungan teknis."
            : "Authentication issue occurred. Please contact technical support.";
          break;
        case 402:
          errorMessage = language === "id"
            ? "Layanan sementara tidak tersedia. Silakan coba lagi nanti."
            : "Service temporarily unavailable. Please try again later.";
          break;
        case 500:
        case 503:
          errorMessage = language === "id"
            ? "Server AI sedang mengalami gangguan. Silakan hubungi kami di (021) 89088260."
            : "AI server is experiencing issues. Please contact us at (021) 89088260.";
          break;
        default:
          errorMessage = language === "id"
            ? "Terjadi kesalahan tak terduga. Silakan hubungi kami di (021) 89088260 untuk bantuan."
            : "An unexpected error occurred. Please contact us at (021) 89088260 for assistance.";
      }
      
      throw new Error(errorMessage);
    } else if (error.request) {
      const networkError = language === "id"
        ? "Tidak dapat terhubung ke server AI. Periksa koneksi internet Anda atau hubungi kami di (021) 89088260."
        : "Cannot connect to AI server. Please check your internet connection or contact us at (021) 89088260.";
      throw new Error(networkError);
    } else {
      const unknownError = language === "id"
        ? "Terjadi kesalahan sistem. Silakan hubungi dukungan teknis di (021) 89088260."
        : "A system error occurred. Please contact technical support at (021) 89088260.";
      throw new Error(unknownError);
    }
  }
}
