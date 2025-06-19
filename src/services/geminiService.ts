import axios from 'axios';
import { API_CONFIG, CHATBOT_CONFIG, COMPANY_INFO } from '../utils/constants'; // Import COMPANY_INFO
import { ImageAnalysisResult, ConversationTurn } from '../types/chatbot';
import { getRecommendationsForCategory, estimateCost } from '../data/printingSpecs';
import { aiConfigService } from './aiConfigService';
import { chatbotContentService } from './chatbotContentService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
  };
}

/**
 * Enhanced Gemini service with CMS integration and configurable AI parameters
 */
export class GeminiService {
  private static instance: GeminiService;

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  private constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }
  }

  /**
   * Generate response with CMS integration and conversation context
   */
  async generateResponse(
    message: string,
    language: string = 'id',
    conversationHistory: ConversationTurn[] = []
  ): Promise<string> {
    try {
      // First, check for CMS-driven responses
      const cmsResponse = await chatbotContentService.findMatchingResponse(message, language);

      if (cmsResponse) {
        const responseText = chatbotContentService.getResponseText(cmsResponse, language);

        // If it's a static response, return it directly
        if (cmsResponse.responseType === 'static') {
          return responseText;
        }

        // If it's an RFQ trigger, return the trigger message
        if (cmsResponse.responseType === 'rfq_trigger') {
          return responseText;
        }

        // For dynamic prompts, use the CMS text as part of the prompt
        if (cmsResponse.responseType === 'dynamic_prompt') {
          const prompt = this.buildConversationPrompt(message, language, conversationHistory, responseText);
          return await this.callGeminiAPI([{ text: prompt }]);
        }
      }

      // Fallback to regular AI response
      const prompt = this.buildConversationPrompt(message, language, conversationHistory);
      return await this.callGeminiAPI([{ text: prompt }]);

    } catch (error) {
      console.error('Text generation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze image and provide printing recommendations
   */
  async analyzeImage(
    imageBase64: string,
    imageMimeType: string,
    userMessage: string,
    language: string = 'id'
  ): Promise<{ response: string; analysis: ImageAnalysisResult }> {
    const prompt = this.buildImageAnalysisPrompt(userMessage, language);

    try {
      const response = await this.callGeminiAPI([
        {
          inlineData: {
            mimeType: imageMimeType,
            data: imageBase64
          }
        },
        { text: prompt }
      ]);

      const analysisResult = this.parseImageAnalysisResponse(response);

      return {
        response,
        analysis: analysisResult
      };
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive image analysis prompt
   */
  private buildImageAnalysisPrompt(userMessage: string, language: string): string {
    const languageMap: { [key: string]: string } = {
      en: "English",
      id: "Indonesian",
      ja: "Japanese",
      zh: "Chinese",
      ar: "Arabic",
    };

    const responseLanguage = languageMap[language] || "Indonesian";

    return `You are Emran Chatbot, the official AI assistant for ${COMPANY_INFO.NAME}, a premium printing and labeling company established in ${new Date(COMPANY_INFO.ESTABLISHED).getFullYear()} in Tangerang, Banten, Indonesia.

**CRITICAL INSTRUCTIONS FOR IMAGE ANALYSIS:**

1.  **ANALYZE THE IMAGE SYSTEMATICALLY:**
    -   Identify all visible objects, text, design elements, and materials
    -   Determine the likely product category (business cards, brochures, banners, stickers, packaging, etc.)
    -   Assess print quality, color usage, and design complexity
    -   Estimate approximate dimensions if possible from visual cues

2.  **PROVIDE STRUCTURED ANALYSIS:**
    -   **Detected Objects:** List what you see (text, logos, images, shapes, etc.)
    -   **Product Category:** Primary category and printing type recommendation
    -   **Material Recommendations:** Suggest appropriate materials based on the design
    -   **Quality Assessment:** Comment on current quality and potential improvements
    -   **Size Estimation:** If possible, estimate dimensions
    -   **Cost Estimation:** Provide rough price range in Indonesian Rupiah

3.  **COMPANY-SPECIFIC RECOMMENDATIONS:**
    -   Reference ${COMPANY_INFO.NAME}'s capabilities:
        * Digital printing (17,500 units/day capacity)
        * Offset printing (49,000 units/day capacity)
        * Large format printing
        * Custom packaging solutions
        * Professional finishing options
    -   Suggest relevant services from our portfolio
    -   Mention our quality standards and turnaround times

4.  **RESPONSE FORMAT:**
    -   Keep response under 80 words
    -   Be specific and actionable
    -   Include a call-to-action to contact us
    -   Respond in ${responseLanguage}

**USER MESSAGE:** ${userMessage}

**COMPANY CONTACT INFO:**
- Phone: ${COMPANY_INFO.PHONE}
- Direct: ${COMPANY_INFO.DIRECT_CONTACT.NAME} at ${COMPANY_INFO.DIRECT_CONTACT.PHONE}
- Email: ${COMPANY_INFO.EMAIL}
- Location: ${COMPANY_INFO.ADDRESS}

Please analyze the image and provide helpful recommendations for ${COMPANY_INFO.NAME}'s printing services.`;
  }

  /**
   * Build conversation prompt with context and optional CMS guidance
   */
  private buildConversationPrompt(
    message: string,
    language: string,
    conversationHistory: ConversationTurn[],
    cmsGuidance?: string
  ): string {
    const languageMap: { [key: string]: string } = {
      en: "English",
      id: "Indonesian",
      ja: "Japanese",
      zh: "Chinese",
      ar: "Arabic",
    };

    const responseLanguage = languageMap[language] || "Indonesian";

    // Build conversation context
    let contextSection = "";
    if (conversationHistory.length > 0) {
      contextSection = "\n**CONVERSATION CONTEXT:**\n";
      conversationHistory.slice(-3).forEach((turn, index) => {
        contextSection += `${index + 1}. User: "${turn.userMessage}"\n   Bot: "${turn.botResponse}"\n`;
      });
    }

    // Add CMS guidance if provided
    let cmsSection = "";
    if (cmsGuidance) {
      cmsSection = `\n**CMS GUIDANCE:**\n${cmsGuidance}\n`;
    }

    return `You are Emran Chatbot, the official AI assistant for ${COMPANY_INFO.NAME}, a premium printing and labeling company established in ${new Date(COMPANY_INFO.ESTABLISHED).getFullYear()} in Tangerang, Banten, Indonesia.

**YOUR IDENTITY:**
- Name: Emran Chatbot
- Role: Virtual Assistant for ${COMPANY_INFO.NAME}
- Personality: Professional, helpful, knowledgeable, customer-focused

**COMPANY PROFILE:**
${COMPANY_INFO.NAME} specializes in high-quality printing and labeling solutions for retail, fashion, and logistics industries. We offer UPC labels, stickers, books, calendars, brochures, polybags, barcode labels, hangtags, size labels, care labels, inboxes, screen printing, custom ribbons, and personalized stationery.

**KEY INFORMATION:**
- **Established:** ${COMPANY_INFO.ESTABLISHED_DATE}
- **Location:** ${COMPANY_INFO.ADDRESS}
- **Contact:** Email: ${COMPANY_INFO.EMAIL} | Phone: ${COMPANY_INFO.PHONE} | Direct: ${COMPANY_INFO.DIRECT_CONTACT.NAME} at ${COMPANY_INFO.DIRECT_CONTACT.PHONE}
- **Partners:** PT. UNIMITRA KHARISMA, PT. HWA SEUNG INDONESIA, PT. SMART MULTI FINANCE
- **Production Capacity:** Cutting machines (17,500 units/day), Offset printers (49,000 units/day), Sealing machines (35,000 units/day)

**RESPONSE GUIDELINES:**
1.  **Language:** Respond strictly in ${responseLanguage}
2.  **Length:** Keep responses under 60 words, focusing on direct and helpful information
3.  **Tone:** Maintain professional, friendly, customer-service oriented tone
4.  **Relevance:** Prioritize ${COMPANY_INFO.NAME}'s services and capabilities
5.  **Accuracy:** Only provide factual information based on company profile
6.  **Call-to-Action:** When appropriate, encourage contact for quotes or consultations
${contextSection}${cmsSection}
**CURRENT USER MESSAGE:** ${message}

Please provide a helpful, accurate response that represents ${COMPANY_INFO.NAME} professionally.`
  }

  /**
   * Call Gemini API with configurable parameters and retry logic
   */
  private async callGeminiAPI(parts: any[], retries: number = 3): Promise<string> {
    const url = `${API_CONFIG.GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

    // Get AI configuration from CMS
    const aiConfig = await aiConfigService.getGeminiConfig();

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post<GeminiResponse>(
          url,
          {
            contents: [{ parts }],
            generationConfig: {
              maxOutputTokens: aiConfig.maxOutputTokens,
              temperature: aiConfig.temperature,
              topP: aiConfig.topP,
              topK: aiConfig.topK,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: API_CONFIG.TIMEOUT.IMAGE_ANALYSIS,
          }
        );

        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
          throw new Error('Empty response from Gemini API');
        }

        return reply.trim();
      } catch (error: any) {
        console.error(`Gemini API attempt ${attempt} failed:`, error);

        if (error.response?.status === 429 && attempt < retries) {
          // Rate limit - wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }

        if (attempt === retries) {
          throw this.handleGeminiError(error);
        }
      }
    }

    throw new Error('All Gemini API attempts failed');
  }

  /**
   * Parse image analysis response to extract structured data
   */
  private parseImageAnalysisResponse(response: string): ImageAnalysisResult {
    // This is a simplified parser - in production, you might want more sophisticated parsing
    const defaultResult: ImageAnalysisResult = {
      detectedObjects: [],
      productCategory: {
        primary: 'general',
        printingType: 'digital'
      },
      materialRecommendations: [],
      confidence: 0.7
    };

    try {
      // Try to extract structured information from the response
      const lowerResponse = response.toLowerCase();

      // Detect product category
      if (lowerResponse.includes('kartu nama') || lowerResponse.includes('business card')) {
        defaultResult.productCategory = { primary: 'business-cards', printingType: 'digital' };
        defaultResult.materialRecommendations = getRecommendationsForCategory('business-cards');
      } else if (lowerResponse.includes('brosur') || lowerResponse.includes('brochure')) {
        defaultResult.productCategory = { primary: 'brochures', printingType: 'offset' };
        defaultResult.materialRecommendations = getRecommendationsForCategory('brochures');
      } else if (lowerResponse.includes('banner') || lowerResponse.includes('spanduk')) {
        defaultResult.productCategory = { primary: 'banners', printingType: 'large-format' };
        defaultResult.materialRecommendations = getRecommendationsForCategory('banners');
      } else if (lowerResponse.includes('stiker') || lowerResponse.includes('sticker')) {
        defaultResult.productCategory = { primary: 'stickers', printingType: 'digital' };
        defaultResult.materialRecommendations = getRecommendationsForCategory('stickers');
      }

      // Add cost estimation
      if (defaultResult.materialRecommendations.length > 0) {
        const estimatedCost = estimateCost(
          defaultResult.materialRecommendations[0].material,
          100 // Default quantity
        );
        defaultResult.costEstimation = estimatedCost;
      }

      return defaultResult;
    } catch (error) {
      console.error('Error parsing image analysis response:', error);
      return defaultResult;
    }
  }

  /**
   * Handle Gemini API errors with user-friendly messages
   */
  private handleGeminiError(error: any): Error {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          return new Error(language === 'id' ? 'Permintaan tidak valid. Silakan coba dengan pertanyaan yang berbeda.' : 'Invalid request. Please try with a different question.');
        case 401:
        case 403:
          return new Error(language === 'id' ? 'Terjadi masalah autentikasi. Silakan hubungi dukungan teknis.' : 'Authentication issue occurred. Please contact technical support.');
        case 429:
          return new Error(language === 'id' ? 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.' : 'Too many requests. Please wait a moment and try again.');
        case 500:
        case 503:
          return new Error(language === 'id' ? `Server AI sedang mengalami gangguan. Silakan hubungi kami di ${COMPANY_INFO.PHONE}.` : `AI server is experiencing issues. Please contact us at ${COMPANY_INFO.PHONE}.`);
        default:
          return new Error(language === 'id' ? `Terjadi kesalahan tak terduga. Silakan hubungi kami di ${COMPANY_INFO.PHONE}.` : `An unexpected error occurred. Please contact us at ${COMPANY_INFO.PHONE}.`);
      }
    } else if (error.request) {
      return new Error(language === 'id' ? `Tidak dapat terhubung ke server AI. Periksa koneksi internet Anda atau hubungi kami di ${COMPANY_INFO.PHONE}.` : `Cannot connect to AI server. Please check your internet connection or contact us at ${COMPANY_INFO.PHONE}.`);
    } else {
      return new Error(language === 'id' ? `Terjadi kesalahan sistem. Silakan hubungi dukungan teknis di ${COMPANY_INFO.PHONE}.` : `A system error occurred. Please contact technical support at ${COMPANY_INFO.PHONE}.`);
    }
  }
}

// Export singleton instance
export const geminiService = GeminiService.getInstance();