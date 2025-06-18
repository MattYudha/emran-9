export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  hasImage?: boolean;
  imageUrl?: string;
  imageName?: string;
  imageAnalysis?: ImageAnalysisResult;
}

export interface SuggestedResponse {
  id: string;
  text: string;
  category?: string;
  priority?: number;
}

export interface ImageAnalysisResult {
  detectedObjects: DetectedObject[];
  productCategory: ProductCategory;
  materialRecommendations: MaterialRecommendation[];
  sizeEstimation?: SizeEstimation;
  costEstimation?: CostEstimation;
  confidence: number;
}

export interface DetectedObject {
  name: string;
  confidence: number;
  category: string;
}

export interface ProductCategory {
  primary: string;
  secondary?: string;
  printingType: "digital" | "offset" | "large-format" | "packaging";
}

export interface MaterialRecommendation {
  material: string;
  description: string;
  suitability: number;
  finishingOptions: string[];
}

export interface SizeEstimation {
  estimatedWidth?: number;
  estimatedHeight?: number;
  unit: "mm" | "cm" | "m";
  confidence: number;
}

export interface CostEstimation {
  minPrice: number;
  maxPrice: number;
  currency: string;
  factors: string[];
}

export interface ChatbotState {
  messages: Message[];
  isTyping: boolean;
  isImageUploading: boolean;
  error: string | null;
  suggestions: SuggestedResponse[];
  usedSuggestions: Set<string>;
  conversationHistory: ConversationTurn[];
}

export interface ConversationTurn {
  userMessage: string;
  botResponse: string;
  timestamp: Date;
  hasImage?: boolean;
}

export type ChatbotAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_IMAGE_UPLOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUGGESTIONS"; payload: SuggestedResponse[] }
  | { type: "ADD_USED_SUGGESTION"; payload: string }
  | { type: "UPDATE_MESSAGE_STATUS"; payload: { id: string; status: Message["status"] } }
  | { type: "CLEAR_CONVERSATION" };
