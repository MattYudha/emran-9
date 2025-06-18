export interface RFQData {
  userName: string;
  userEmail: string;
  projectName: string;
  productCategory?: string;
  sizeSpecifications: string;
  quantity: number;
  deadline?: string;
  designFileUrls?: string[];
  additionalNotes?: string;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  currency?: string;
  language?: string;
}

export interface RFQSubmission extends RFQData {
  id: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'completed' | 'cancelled';
  sourceIp?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RFQFormStep {
  step: number;
  title: string;
  field: keyof RFQData;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'file';
  required: boolean;
  options?: string[];
  validation?: (value: any) => string | null;
}

export interface ChatbotResponse {
  id: string;
  keywordTriggers: string[];
  responseTextEn: string;
  responseTextId: string;
  responseTextJa?: string;
  responseTextZh?: string;
  responseTextAr?: string;
  responseType: 'static' | 'dynamic_prompt' | 'faq' | 'rfq_trigger';
  priority: number;
  isActive: boolean;
  category?: string;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIConfig {
  id: string;
  parameterName: string;
  parameterValue: number;
  parameterType: 'number' | 'string' | 'boolean';
  description?: string;
  minValue?: number;
  maxValue?: number;
  isActive: boolean;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIFeedback {
  id: string;
  imageUrl?: string;
  userQuery: string;
  aiResponse: string;
  userFeedback?: 'positive' | 'negative' | 'neutral';
  correctResponse?: string;
  feedbackNotes?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reviewerId?: string;
  sessionId?: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}
