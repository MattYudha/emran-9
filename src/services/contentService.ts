import { supabase } from '../api/supabaseClient';
import { CompanyInfo, ServiceDetail, TeamMember, PortfolioItem } from '../types/content';

export class ContentService {
  private static instance: ContentService;
  
  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  /**
   * Fetch company information
   */
  async fetchCompanyInfo(): Promise<CompanyInfo | null> {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching company info:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchCompanyInfo:', error);
      return null;
    }
  }

  /**
   * Fetch service details by service key
   */
  async fetchServiceDetail(serviceKey: string): Promise<ServiceDetail | null> {
    try {
      const { data, error } = await supabase
        .from('services_detail')
        .select('*')
        .eq('service_key', serviceKey)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching service detail:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchServiceDetail:', error);
      return null;
    }
  }

  /**
   * Fetch all active services
   */
  async fetchAllServices(): Promise<ServiceDetail[]> {
    try {
      const { data, error } = await supabase
        .from('services_detail')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchAllServices:', error);
      return [];
    }
  }

  /**
   * Fetch team members
   */
  async fetchTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchTeamMembers:', error);
      return [];
    }
  }

  /**
   * Fetch portfolio items
   */
  async fetchPortfolioItems(category?: string): Promise<PortfolioItem[]> {
    try {
      let query = supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_active', true);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('order', { ascending: true });

      if (error) {
        console.error('Error fetching portfolio items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchPortfolioItems:', error);
      return [];
    }
  }

  /**
   * Get fallback company profile for chatbot
   */
  getFallbackCompanyProfile() {
    return {
      about: `PT. EMRAN GHANIM ASAHI, established on **April 3, 2023**, is a leading provider of **printing and labeling services** based in Tangerang, Banten. Our vision is to become a global leader by delivering **high-quality, innovative solutions** for the retail, fashion, and logistics sectors, backed by state-of-the-art equipment and a dedicated professional team.`,
      services: `We offer a comprehensive range of products including **UPC labels, stickers, custom books, calendars, brochures, polybags, barcode labels, hangtags, size labels, care labels, inboxes, screen printing services, custom ribbons, and personalized stationery**. Our solutions cater to diverse industry needs with premium quality materials and advanced printing technology.`,
      contact: `You can reach us at **The Avenue Block Z 06/36, Citra Raya, Cikupa, Tangerang**. For inquiries, email us at **sales@emranghanimasahi.net** or call us at **(021) 89088260**. You can also directly contact **Mr. Darmawan at 0813-9831-8839** for immediate assistance.`,
      partners: `We proudly collaborate with esteemed partners such as **PT. UNIMITRA KHARISMA, PT. HWA SEUNG INDONESIA, and PT. SMART MULTI FINANCE**, enabling us to undertake and successfully deliver large-scale projects with guaranteed quality and timely delivery.`,
      equipment: `Our production capabilities are supported by advanced machinery, including **cutting machines (17,500 units/day), offset printers (49,000 units/day), and sealing machines (35,000 units/day)**, ensuring high-quality output and efficient production that meets international standards.`,
      legal: `PT. EMRAN GHANIM ASAHI operates under full compliance with Indonesian regulations, possessing a valid **Akta Pendirian (Deed of Establishment), NPWP (Taxpayer Identification Number), and NIB (Business Identification Number)**, ensuring complete legal compliance and business transparency.`,
      whyChooseUs: `Choose PT. EMRAN GHANIM ASAHI for **superior quality printing, timely delivery, competitive pricing, and professional service** tailored for the retail, fashion, and logistics industries. We are committed to exceeding your expectations with every project through innovation and excellence.`,
      pricing: `We offer competitive pricing with flexible payment terms. Our rates vary based on quantity, materials, and finishing options. Contact us for a detailed quote tailored to your specific requirements. We also provide bulk discounts for large orders.`,
      quality: `Quality is our top priority. We use premium materials, advanced printing technology, and strict quality control processes. All our products undergo thorough inspection before delivery to ensure they meet the highest standards.`,
      turnaround: `Our standard turnaround time is 3-7 business days depending on the complexity and quantity of your order. We also offer rush services for urgent projects with same-day or next-day delivery options available.`,
      generalInquiry: `I'm Emran Chatbot, your dedicated assistant for PT. EMRAN GHANIM ASAHI's **printing and labeling services**. I'm here to help you with information about our products, services, pricing, and company details. Please feel free to ask me anything!`,
      imageAnalysis: `Based on the image you've shared, I can provide specific recommendations for our printing services. Our team specializes in analyzing design requirements and suggesting the best printing solutions for your needs.`
    };
  }
}

// Export singleton instance
export const contentService = ContentService.getInstance();
