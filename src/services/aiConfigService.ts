import { supabase } from '../api/supabaseClient';
import { AIConfig } from '../types/rfq';

export class AIConfigService {
  private static instance: AIConfigService;
  private configCache: Map<string, number> = new Map();
  private cacheExpiry: number = 10 * 60 * 1000; // 10 minutes
  private lastCacheUpdate: number = 0;
  
  public static getInstance(): AIConfigService {
    if (!AIConfigService.instance) {
      AIConfigService.instance = new AIConfigService();
    }
    return AIConfigService.instance;
  }

  /**
   * Fetch AI configuration parameters with caching
   */
  async fetchAIConfig(forceRefresh: boolean = false): Promise<Map<string, number>> {
    const now = Date.now();
    
    // Check cache first
    if (!forceRefresh && 
        this.configCache.size > 0 && 
        (now - this.lastCacheUpdate) < this.cacheExpiry) {
      return this.configCache;
    }

    try {
      const { data, error } = await supabase
        .from('ai_config')
        .select('parameter_name, parameter_value')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching AI config:', error);
        // Return cached data if available, otherwise defaults
        return this.configCache.size > 0 ? this.configCache : this.getDefaultConfig();
      }

      // Update cache
      this.configCache.clear();
      data.forEach(config => {
        this.configCache.set(config.parameter_name, config.parameter_value);
      });
      this.lastCacheUpdate = now;
      
      return this.configCache;
    } catch (error: any) {
      console.error('Error in fetchAIConfig:', error);
      return this.configCache.size > 0 ? this.configCache : this.getDefaultConfig();
    }
  }

  /**
   * Get specific AI parameter value
   */
  async getParameter(parameterName: string, defaultValue?: number): Promise<number> {
    const config = await this.fetchAIConfig();
    return config.get(parameterName) ?? defaultValue ?? this.getDefaultValue(parameterName);
  }

  /**
   * Get AI parameters for Gemini API
   */
  async getGeminiConfig(): Promise<{
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
  }> {
    const config = await this.fetchAIConfig();
    
    return {
      temperature: config.get('temperature') ?? 0.4,
      topP: config.get('topP') ?? 0.8,
      topK: config.get('topK') ?? 40,
      maxOutputTokens: config.get('maxOutputTokens') ?? 200
    };
  }

  /**
   * Update AI configuration parameter (admin only)
   */
  async updateParameter(parameterName: string, value: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_config')
        .update({ 
          parameter_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('parameter_name', parameterName);

      if (error) {
        console.error('Error updating AI config:', error);
        throw new Error('Failed to update AI configuration');
      }

      // Update cache
      this.configCache.set(parameterName, value);
    } catch (error: any) {
      console.error('Error in updateParameter:', error);
      throw error;
    }
  }

  /**
   * Add new AI configuration parameter (admin only)
   */
  async addParameter(config: Omit<AIConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_config')
        .insert([
          {
            parameter_name: config.parameterName,
            parameter_value: config.parameterValue,
            parameter_type: config.parameterType,
            description: config.description,
            min_value: config.minValue,
            max_value: config.maxValue,
            is_active: config.isActive,
            last_updated_by: config.lastUpdatedBy
          }
        ]);

      if (error) {
        console.error('Error adding AI config:', error);
        throw new Error('Failed to add AI configuration');
      }

      // Clear cache to force refresh
      this.configCache.clear();
    } catch (error: any) {
      console.error('Error in addParameter:', error);
      throw error;
    }
  }

  /**
   * Get all AI configuration parameters (admin only)
   */
  async getAllParameters(): Promise<AIConfig[]> {
    try {
      const { data, error } = await supabase
        .from('ai_config')
        .select('*')
        .order('parameter_name');

      if (error) {
        console.error('Error fetching all AI config:', error);
        throw new Error('Failed to fetch AI configuration');
      }

      return data.map(this.mapDatabaseToAIConfig);
    } catch (error: any) {
      console.error('Error in getAllParameters:', error);
      throw error;
    }
  }

  /**
   * Clear configuration cache
   */
  clearCache(): void {
    this.configCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Get default configuration values
   */
  private getDefaultConfig(): Map<string, number> {
    const defaults = new Map();
    defaults.set('temperature', 0.4);
    defaults.set('topP', 0.8);
    defaults.set('topK', 40);
    defaults.set('maxOutputTokens', 200);
    return defaults;
  }

  /**
   * Get default value for specific parameter
   */
  private getDefaultValue(parameterName: string): number {
    const defaults = this.getDefaultConfig();
    return defaults.get(parameterName) ?? 0;
  }

  /**
   * Map database record to AIConfig type
   */
  private mapDatabaseToAIConfig(data: any): AIConfig {
    return {
      id: data.id,
      parameterName: data.parameter_name,
      parameterValue: data.parameter_value,
      parameterType: data.parameter_type,
      description: data.description,
      minValue: data.min_value,
      maxValue: data.max_value,
      isActive: data.is_active,
      lastUpdatedBy: data.last_updated_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// Export singleton instance
export const aiConfigService = AIConfigService.getInstance();
