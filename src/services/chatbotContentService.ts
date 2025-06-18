import { supabase } from '../api/supabaseClient';
import { ChatbotResponse } from '../types/rfq';

export class ChatbotContentService {
  private static instance: ChatbotContentService;
  private responseCache: Map<string, ChatbotResponse[]> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastCacheUpdate: number = 0;
  
  public static getInstance(): ChatbotContentService {
    if (!ChatbotContentService.instance) {
      ChatbotContentService.instance = new ChatbotContentService();
    }
    return ChatbotContentService.instance;
  }

  /**
   * Fetch chatbot responses from CMS with caching
   */
  async fetchChatbotResponses(forceRefresh: boolean = false): Promise<ChatbotResponse[]> {
    const now = Date.now();
    const cacheKey = 'chatbot_responses';
    
    // Check cache first
    if (!forceRefresh && 
        this.responseCache.has(cacheKey) && 
        (now - this.lastCacheUpdate) < this.cacheExpiry) {
      return this.responseCache.get(cacheKey)!;
    }

    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching chatbot responses:', error);
        // Return cached data if available, otherwise empty array
        return this.responseCache.get(cacheKey) || [];
      }

      const responses = data.map(this.mapDatabaseToChatbotResponse);
      
      // Update cache
      this.responseCache.set(cacheKey, responses);
      this.lastCacheUpdate = now;
      
      return responses;
    } catch (error: any) {
      console.error('Error in fetchChatbotResponses:', error);
      return this.responseCache.get(cacheKey) || [];
    }
  }

  /**
   * Find matching response for user input
   */
  async findMatchingResponse(userInput: string, language: string = 'id'): Promise<ChatbotResponse | null> {
    const responses = await this.fetchChatbotResponses();
    const lowerInput = userInput.toLowerCase();
    
    // Sort by priority and find first match
    for (const response of responses) {
      for (const trigger of response.keywordTriggers) {
        if (lowerInput.includes(trigger.toLowerCase())) {
          return response;
        }
      }
    }
    
    return null;
  }

  /**
   * Get response text in specified language
   */
  getResponseText(response: ChatbotResponse, language: string): string {
    switch (language) {
      case 'en':
        return response.responseTextEn;
      case 'id':
        return response.responseTextId;
      case 'ja':
        return response.responseTextJa || response.responseTextEn;
      case 'zh':
        return response.responseTextZh || response.responseTextEn;
      case 'ar':
        return response.responseTextAr || response.responseTextEn;
      default:
        return response.responseTextEn;
    }
  }

  /**
   * Add new chatbot response (admin only)
   */
  async addChatbotResponse(response: Omit<ChatbotResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChatbotResponse> {
    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .insert([
          {
            keyword_triggers: response.keywordTriggers,
            response_text_en: response.responseTextEn,
            response_text_id: response.responseTextId,
            response_text_ja: response.responseTextJa,
            response_text_zh: response.responseTextZh,
            response_text_ar: response.responseTextAr,
            response_type: response.responseType,
            priority: response.priority,
            is_active: response.isActive,
            category: response.category,
            last_updated_by: response.lastUpdatedBy
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding chatbot response:', error);
        throw new Error('Failed to add chatbot response');
      }

      // Clear cache to force refresh
      this.responseCache.clear();
      
      return this.mapDatabaseToChatbotResponse(data);
    } catch (error: any) {
      console.error('Error in addChatbotResponse:', error);
      throw error;
    }
  }

  /**
   * Update chatbot response (admin only)
   */
  async updateChatbotResponse(id: string, updates: Partial<ChatbotResponse>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.keywordTriggers) updateData.keyword_triggers = updates.keywordTriggers;
      if (updates.responseTextEn) updateData.response_text_en = updates.responseTextEn;
      if (updates.responseTextId) updateData.response_text_id = updates.responseTextId;
      if (updates.responseTextJa) updateData.response_text_ja = updates.responseTextJa;
      if (updates.responseTextZh) updateData.response_text_zh = updates.responseTextZh;
      if (updates.responseTextAr) updateData.response_text_ar = updates.responseTextAr;
      if (updates.responseType) updateData.response_type = updates.responseType;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.category) updateData.category = updates.category;
      if (updates.lastUpdatedBy) updateData.last_updated_by = updates.lastUpdatedBy;

      const { error } = await supabase
        .from('chatbot_responses')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating chatbot response:', error);
        throw new Error('Failed to update chatbot response');
      }

      // Clear cache to force refresh
      this.responseCache.clear();
    } catch (error: any) {
      console.error('Error in updateChatbotResponse:', error);
      throw error;
    }
  }

  /**
   * Delete chatbot response (admin only)
   */
  async deleteChatbotResponse(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chatbot_responses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting chatbot response:', error);
        throw new Error('Failed to delete chatbot response');
      }

      // Clear cache to force refresh
      this.responseCache.clear();
    } catch (error: any) {
      console.error('Error in deleteChatbotResponse:', error);
      throw error;
    }
  }

  /**
   * Clear response cache
   */
  clearCache(): void {
    this.responseCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Map database record to ChatbotResponse type
   */
  private mapDatabaseToChatbotResponse(data: any): ChatbotResponse {
    return {
      id: data.id,
      keywordTriggers: data.keyword_triggers || [],
      responseTextEn: data.response_text_en,
      responseTextId: data.response_text_id,
      responseTextJa: data.response_text_ja,
      responseTextZh: data.response_text_zh,
      responseTextAr: data.response_text_ar,
      responseType: data.response_type,
      priority: data.priority,
      isActive: data.is_active,
      category: data.category,
      lastUpdatedBy: data.last_updated_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// Export singleton instance
export const chatbotContentService = ChatbotContentService.getInstance();
