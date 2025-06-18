export interface CompanyInfo {
  id: string;
  about: string;
  services: string;
  contact: string;
  partners: string;
  equipment: string;
  legal: string;
  whyChooseUs: string;
  pricing: string;
  quality: string;
  turnaround: string;
  generalInquiry: string;
  imageAnalysis: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceDetail {
  id: string;
  serviceKey: string;
  title: string;
  description: string;
  features: string[];
  specifications: ServiceSpecification[];
  pricing: PricingTier[];
  gallery: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  features: string[];
  minQuantity?: number;
  maxQuantity?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  gallery: string[];
  client?: string;
  completedAt: Date;
  tags: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}
