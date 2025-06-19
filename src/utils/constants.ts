// src/utils/constants.ts
// API Configuration
export const API_CONFIG = {
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  SUPABASE_FUNCTIONS_URL: '/functions/v1',
  TIMEOUT: {
    DEFAULT: 10000,
    IMAGE_ANALYSIS: 15000,
    FORM_SUBMISSION: 8000
  }
} as const;

// Chatbot Configuration
export const CHATBOT_CONFIG = {
  MAX_CONVERSATION_HISTORY: 7,
  MAX_SUGGESTIONS: 4,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  TYPING_DELAY: 1000,
  PROACTIVE_MESSAGE_DELAY: 15000 // 15 seconds
} as const;

// Company Information
export const COMPANY_INFO = {
  NAME: 'PT. EMRAN GHANIM ASAHI',
  ESTABLISHED: '2023-04-03', // Original format
  ESTABLISHED_DATE: 'April 3, 2023', // Human-readable format
  ADDRESS: 'The Avenue Blok Z 06/36, Citra Raya, Cikupa, Tangerang',
  PHONE: '(021) 89088260',
  EMAIL: 'sales@emranghanimasahi.net',
  DIRECT_CONTACT: {
    NAME: 'Mr. Darmawan',
    PHONE: '0813-9831-8839'
  },
  COMPANY_EMAIL_RECEIVER: 'emranghanimasahi@gmail.com', // Added for backend email receiver
  TIMEZONE: 'Asia/Jakarta'
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  CHATBOT_MESSAGE_SENT: 'chatbot_message_sent',
  IMAGE_UPLOADED: 'image_uploaded',
  IMAGE_ANALYZED: 'image_analyzed',
  SUGGESTION_CLICKED: 'suggestion_clicked',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  PAGE_VIEW: 'page_view',
  SERVICE_PAGE_VISITED: 'service_page_visited',
  PROACTIVE_MESSAGE_SHOWN: 'proactive_message_shown'
} as const;

// Cache Names for PWA
export const CACHE_NAMES = {
  STATIC: 'static-resources-v1',
  IMAGES: 'images-v1',
  PAGES: 'pages-v1',
  API: 'api-responses-v1'
} as const;

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'id',
  THEME: 'light',
  CURRENCY: 'IDR',
  PAGINATION_SIZE: 10
} as const;

// Validation Rules
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// Time Constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
} as const;