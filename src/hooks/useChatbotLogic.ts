// src/hooks/useChatbotLogic.ts
import { useReducer, useCallback, useEffect, useState, useRef } from 'react'; // Tambahkan useRef
import { v4 as uuidv4 } from 'uuid';
import { chatbotReducer, initialChatbotState } from '../reducers/chatbotReducer';
import { Message, SuggestedResponse } from '../types/chatbot';
import { RFQData } from '../types/rfq';
import { geminiService } from '../services/geminiService';
import { analyticsService } from '../services/analyticsService';
import { rfqService } from '../services/rfqService';
import { chatbotContentService } from '../services/chatbotContentService';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { getTimeBasedGreeting, isBusinessHours, validateImageFile, fileToBase64 } from '../utils/helpers';
import { CHATBOT_CONFIG } from '../utils/constants';

export function useChatbotLogic() {
  const [state, dispatch] = useReducer(chatbotReducer, initialChatbotState);
  const [rfqMode, setRfqMode] = useState(false);
  const [showRfqForm, setShowRfqForm] = useState(false);
  const [rfqData, setRfqData] = useState<Partial<RFQData>>({});
  const [userInput, setUserInput] = useState("");
  const { language } = useLanguage();
  const t = translations[language];

  const isInitialized = useRef(false); // Ditambahkan: useRef untuk status inisialisasi

  // Initialize chatbot with welcome message
  useEffect(() => {
    // Pastikan inisialisasi hanya berjalan sekali, terutama di StrictMode.
    // Gunakan isInitialized.current agar tidak memengaruhi render kedua di dev mode.
    if (isInitialized.current) {
      return;
    }

    const greeting = getTimeBasedGreeting();
    const businessHoursNote = isBusinessHours()
      ? "Tim kami sedang online dan siap membantu!"
      : "Meskipun di luar jam kerja, saya tetap siap membantu Anda 24/7.";

    const welcomeMessage: Message = {
      id: uuidv4(),
      sender: "bot",
      text: language === "id"
        ? `${greeting}! Saya Emran Chatbot, asisten virtual PT Emran Ghanim Asahi. ${businessHoursNote} Saya siap membantu dengan informasi layanan percetakan dan labeling kami. Anda juga bisa mengunggah gambar untuk analisis! Ada yang bisa saya bantu hari ini?`
        : `${greeting}! I'm Emran Chatbot, your virtual assistant for PT Emran Ghanim Asahi. ${businessHoursNote} I'm here to help with information about our printing and labeling services. You can also upload images for analysis! How can I assist you today?`,
      timestamp: new Date(),
    };

    // Hanya tambahkan pesan jika belum ada pesan (untuk kasus refresh atau clear)
    if (state.messages.length === 0) { //
      dispatch({ type: 'ADD_MESSAGE', payload: welcomeMessage }); //
      
      // Set initial suggestions
      const initialSuggestions = generateDynamicSuggestions("", language, new Set(), false);
      dispatch({ type: 'SET_SUGGESTIONS', payload: initialSuggestions }); //
      
      isInitialized.current = true; // Tandai sudah diinisialisasi
    }
  }, [language, state.messages.length]); // Pertahankan 'language' di dependency array

  /**
   * Process user text message with RFQ detection
   */
  const processUserMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text: text,
      timestamp: new Date(),
      status: "sending",
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_TYPING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Check for RFQ triggers first
      const cmsResponse = await chatbotContentService.findMatchingResponse(text, language);
      
      if (cmsResponse?.responseType === 'rfq_trigger') {
        const responseText = chatbotContentService.getResponseText(cmsResponse, language);
        
        const botMessage: Message = {
          id: uuidv4(),
          sender: "bot",
          text: responseText,
          timestamp: new Date(),
        };

        dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { id: userMessage.id, status: 'delivered' } });
        dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
        
        // Show RFQ form after a short delay
        setTimeout(() => {
          setShowRfqForm(true);
        }, 1000);
        
        // Generate RFQ-related suggestions
        const rfqSuggestions = generateRFQSuggestions(language);
        dispatch({ type: 'SET_SUGGESTIONS', payload: rfqSuggestions });
        
        return;
      }

      // Get bot response with conversation context
      const botResponse = await geminiService.generateResponse(
        text, 
        language, 
        state.conversationHistory
      );

      const botMessage: Message = {
        id: uuidv4(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date(),
      };

      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { id: userMessage.id, status: 'delivered' } });
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
      
      // Generate new suggestions based on conversation
      const newSuggestions = generateDynamicSuggestions(text, language, state.usedSuggestions);
      dispatch({ type: 'SET_SUGGESTIONS', payload: newSuggestions });

      // Track analytics
      await analyticsService.trackChatbotInteraction({
        messageType: 'text',
        userMessage: text,
        botResponse: botResponse,
        language: language
      });

    } catch (error: any) {
      console.error('Error processing message:', error);
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { id: userMessage.id, status: 'sent' } });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [language, state.conversationHistory, state.usedSuggestions]);

  /**
   * Process image upload and analysis
   */
  const processImageUpload = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      dispatch({ type: 'SET_ERROR', payload: validation.error! });
      return;
    }

    dispatch({ type: 'SET_IMAGE_UPLOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Create image URL for display
      const imageUrl = URL.createObjectURL(file);
      
      // Create user message with image
      const userMessage: Message = {
        id: uuidv4(),
        sender: "user",
        text: language === "id" 
          ? `${t.imageAnalyzing} (${file.name})`
          : `${t.imageAnalyzing} (${file.name})`,
        timestamp: new Date(),
        hasImage: true,
        imageUrl: imageUrl,
        imageName: file.name,
        status: "sending",
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      dispatch({ type: 'SET_TYPING', payload: true });

      // Convert image to base64
      const base64Data = await fileToBase64(file);
      
      // Get AI response with image analysis
      const { response: botResponse, analysis } = await geminiService.analyzeImage(
        base64Data,
        file.type,
        language === "id" 
          ? "Tolong analisis gambar ini dan berikan rekomendasi layanan percetakan yang sesuai."
          : "Please analyze this image and provide suitable printing service recommendations.",
        language
      );

      const botMessage: Message = {
        id: uuidv4(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date(),
      };

      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { id: userMessage.id, status: 'delivered' } });
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });

      // Generate image-related suggestions
      const newSuggestions = generateDynamicSuggestions("image analysis", language, state.usedSuggestions, true);
      dispatch({ type: 'SET_SUGGESTIONS', payload: newSuggestions });

      // Track analytics
      await analyticsService.trackImageUploadAnalysis({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        analysisResult: analysis,
        language: language
      });

      await analyticsService.trackChatbotInteraction({
        messageType: 'image',
        userMessage: `Image uploaded: ${file.name}`,
        botResponse: botResponse,
        hasImageAnalysis: true,
        language: language
      });

    } catch (error: any) {
      console.error("Error analyzing image:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || t.imageAnalysisError });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_IMAGE_UPLOADING', payload: false });
    }
  }, [language, state.usedSuggestions, t]);

  /**
   * Handle RFQ form submission
   */
  const handleRFQSubmit = useCallback(async (rfqData: RFQData) => {
    try {
      // Submit RFQ to database
      const submission = await rfqService.submitRFQ(rfqData);
      
      // Send notification email
      await rfqService.sendRFQNotification(rfqData, submission.id);
      
      // Add success message to chat
      const successMessage: Message = {
        id: uuidv4(),
        sender: "bot",
        text: language === "id"
          ? `Terima kasih! RFQ Anda telah berhasil dikirim dengan ID: ${submission.id}. Tim sales kami akan menghubungi Anda dalam 24 jam untuk memberikan penawaran detail. Untuk pertanyaan mendesak, hubungi Mr. Darmawan di 0813-9831-8839.`
          : `Thank you! Your RFQ has been successfully submitted with ID: ${submission.id}. Our sales team will contact you within 24 hours with a detailed quote. For urgent inquiries, contact Mr. Darmawan at 0813-9831-8839.`,
        timestamp: new Date(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: successMessage });
      setShowRfqForm(false);
      setRfqMode(false);
      
      // Track analytics
      await analyticsService.trackEvent('rfq_completed_via_chatbot', {
        rfqId: submission.id,
        productCategory: rfqData.productCategory,
        quantity: rfqData.quantity,
        language: language
      });
      
    } catch (error: any) {
      console.error('Error submitting RFQ:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "bot",
        text: language === "id"
          ? `Maaf, terjadi kesalahan saat mengirim RFQ Anda. Silakan coba lagi atau hubungi kami langsung di (021) 89088260.`
          : `Sorry, there was an error submitting your RFQ. Please try again or contact us directly at (021) 89088260.`,
        timestamp: new Date(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    }
  }, [language]);

  /**
   * Handle suggestion selection
   */
  const handleSuggestionSelect = useCallback(async (text: string) => {
    // Track suggestion click
    await analyticsService.trackSuggestionClick({
      suggestionText: text,
      category: 'chatbot_suggestion',
      language: language
    });

    // Add to used suggestions to avoid repetition
    dispatch({ type: 'ADD_USED_SUGGESTION', payload: text });
    
    // Process as regular message
    await processUserMessage(text);
  }, [language, processUserMessage]);

  /**
   * Clear conversation
   */
  const clearConversation = useCallback(() => {
    dispatch({ type: 'CLEAR_CONVERSATION' });
    setRfqMode(false);
    setShowRfqForm(false);
    setRfqData({});
    setUserInput(""); // Ditambahkan: Reset userInput saat percakapan dihapus
    
    // Reinitialize with welcome message
    const greeting = getTimeBasedGreeting();
    const welcomeMessage: Message = {
      id: uuidv4(),
      sender: "bot",
      text: language === "id"
        ? `${greeting}! Percakapan baru dimulai. Ada yang bisa saya bantu hari ini?`
        : `${greeting}! New conversation started. How can I assist you today?`,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: welcomeMessage });
    
    // Reset suggestions
    const initialSuggestions = generateDynamicSuggestions("", language, new Set(), false);
    dispatch({ type: 'SET_SUGGESTIONS', payload: initialSuggestions });
  }, [language]);

  return {
    ...state,
    userInput, // Ditambahkan: Kembalikan userInput
    setUserInput, // Ditambahkan: Kembalikan setUserInput
    rfqMode,
    showRfqForm,
    rfqData,
    processUserMessage,
    processImageUpload,
    handleSuggestionSelect,
    handleRFQSubmit,
    setShowRfqForm,
    clearConversation
  };
}

/**
 * Generate RFQ-specific suggestions
 */
function generateRFQSuggestions(language: string): SuggestedResponse[] {
  const suggestions = language === "id" ? [
    "Ya, saya ingin RFQ",
    "Berapa estimasi harga?",
    "Apa saja yang dibutuhkan?",
    "Berapa lama prosesnya?"
  ] : [
    "Yes, I want an RFQ",
    "What's the estimated price?",
    "What information is needed?",
    "How long does it take?"
  ];

  return suggestions.map(text => ({
    id: uuidv4(),
    text,
    category: 'rfq'
  }));
}

/**
 * Generate dynamic suggestions based on context
 */
function generateDynamicSuggestions(
  lastMessage: string,
  language: string,
  usedSuggestions: Set<string>,
  hasImage: boolean = false
): SuggestedResponse[] {
  const lowerMessage = lastMessage.toLowerCase();
  
  const suggestionSets = {
    en: {
      printing: [
        "Digital printing options",
        "Offset printing details", 
        "Large format printing",
        "Printing materials",
        "Turnaround times",
        "Quality standards"
      ],
      services: [
        "Design services",
        "Packaging solutions",
        "Business cards",
        "Brochures & flyers",
        "Custom printing",
        "Finishing options"
      ],
      pricing: [
        "Get a quote",
        "Bulk discounts",
        "Payment terms",
        "Delivery costs",
        "Rush order pricing",
        "Package deals"
      ],
      contact: [
        "Office location",
        "Business hours",
        "Contact methods",
        "Visit our facility",
        "Schedule consultation",
        "Customer support"
      ],
      general: [
        "About our company",
        "Our experience",
        "Quality guarantee",
        "Client testimonials",
        "Portfolio samples",
        "Why choose us"
      ],
      image: [
        "Request detailed quote",
        "Similar printing options",
        "Material recommendations",
        "Quality improvements",
        "Cost optimization",
        "Production timeline"
      ]
    },
    id: {
      printing: [
        "Opsi cetak digital",
        "Detail cetak offset",
        "Cetak format besar",
        "Bahan cetak",
        "Waktu pengerjaan",
        "Standar kualitas"
      ],
      services: [
        "Layanan desain",
        "Solusi kemasan",
        "Kartu nama",
        "Brosur & flyer",
        "Cetak kustom",
        "Opsi finishing"
      ],
      pricing: [
        "Minta penawaran",
        "Diskon volume",
        "Syarat pembayaran",
        "Biaya pengiriman",
        "Harga rush order",
        "Paket hemat"
      ],
      contact: [
        "Lokasi kantor",
        "Jam operasional",
        "Cara kontak",
        "Kunjungi fasilitas",
        "Jadwal konsultasi",
        "Dukungan pelanggan"
      ],
      general: [
        "Tentang perusahaan",
        "Pengalaman kami",
        "Jaminan kualitas",
        "Testimoni klien",
        "Contoh portfolio",
        "Mengapa pilih kami"
      ],
      image: [
        "Minta penawaran detail",
        "Opsi cetak serupa",
        "Rekomendasi material",
        "Peningkatan kualitas",
        "Optimasi biaya",
        "Timeline produksi"
      ]
    }
  };

  const currentLang = language === "id" ? "id" : "en";
  const suggestions = suggestionSets[currentLang];

  let selectedCategory = "general";
  
  // Prioritize image category if image was uploaded
  if (hasImage) {
    selectedCategory = "image";
  } else if (lowerMessage.includes("print") || lowerMessage.includes("cetak")) {
    selectedCategory = "printing";
  } else if (lowerMessage.includes("service") || lowerMessage.includes("layanan")) {
    selectedCategory = "services";
  } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("harga") || lowerMessage.includes("biaya")) {
    selectedCategory = "pricing";
  } else if (lowerMessage.includes("contact") || lowerMessage.includes("kontak") || lowerMessage.includes("hubungi")) {
    selectedCategory = "contact";
  }

  const availableSuggestions = suggestions[selectedCategory].filter(
    suggestion => !usedSuggestions.has(suggestion)
  );

  // If all suggestions in category are used, mix with general suggestions
  if (availableSuggestions.length < 3) {
    const generalSuggestions = suggestions.general.filter(
      suggestion => !usedSuggestions.has(suggestion)
    );
    availableSuggestions.push(...generalSuggestions);
  }

  return availableSuggestions.slice(0, CHATBOT_CONFIG.MAX_SUGGESTIONS).map(text => ({
    id: uuidv4(),
    text,
    category: selectedCategory
  }));
}