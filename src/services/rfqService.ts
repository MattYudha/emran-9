import { supabase } from '../api/supabaseClient';
import { RFQData, RFQSubmission } from '../types/rfq';
import { analyticsService } from './analyticsService';

export class RFQService {
  private static instance: RFQService;
  
  public static getInstance(): RFQService {
    if (!RFQService.instance) {
      RFQService.instance = new RFQService();
    }
    return RFQService.instance;
  }

  /**
   * Upload design files to Supabase Storage
   */
  async uploadDesignFiles(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `rfq-designs/${fileName}`;

      const { data, error } = await supabase.storage
        .from('design-files')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-files')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Submit RFQ data to database
   */
  async submitRFQ(rfqData: RFQData): Promise<RFQSubmission> {
    try {
      const { data, error } = await supabase
        .from('rfq_submissions')
        .insert([
          {
            user_name: rfqData.userName,
            user_email: rfqData.userEmail,
            project_name: rfqData.projectName,
            product_category: rfqData.productCategory,
            size_specifications: rfqData.sizeSpecifications,
            quantity: rfqData.quantity,
            deadline: rfqData.deadline,
            design_file_urls: rfqData.designFileUrls || [],
            additional_notes: rfqData.additionalNotes,
            estimated_cost_min: rfqData.estimatedCostMin,
            estimated_cost_max: rfqData.estimatedCostMax,
            currency: rfqData.currency || 'IDR',
            language: rfqData.language || 'id',
            source_ip: null, // Will be populated by server if needed
            user_agent: navigator.userAgent
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error submitting RFQ:', error);
        throw new Error('Failed to submit RFQ: ' + error.message);
      }

      // Track analytics
      await analyticsService.trackEvent('rfq_submitted', {
        rfqId: data.id,
        productCategory: rfqData.productCategory,
        quantity: rfqData.quantity,
        hasDesignFiles: (rfqData.designFileUrls?.length || 0) > 0,
        language: rfqData.language
      });

      return this.mapDatabaseToRFQ(data);
    } catch (error: any) {
      console.error('Error in submitRFQ:', error);
      throw error;
    }
  }

  /**
   * Send RFQ notification email to sales team
   */
  async sendRFQNotification(rfqData: RFQData, rfqId: string): Promise<void> {
    try {
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = import.meta.env.VITE_RFQ_EMAIL_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const emailjsToEmail = import.meta.env.VITE_EMAILJS_TO_EMAIL;

      if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
        throw new Error('EmailJS configuration missing');
      }

      // Import EmailJS dynamically
      const emailjs = await import('@emailjs/browser');

      const templateParams = {
        rfq_id: rfqId,
        customer_name: rfqData.userName,
        customer_email: rfqData.userEmail,
        project_name: rfqData.projectName,
        product_category: rfqData.productCategory || 'Not specified',
        size_specifications: rfqData.sizeSpecifications,
        quantity: rfqData.quantity.toString(),
        deadline: rfqData.deadline || 'Not specified',
        additional_notes: rfqData.additionalNotes || 'None',
        estimated_cost: rfqData.estimatedCostMin && rfqData.estimatedCostMax 
          ? `${rfqData.currency} ${rfqData.estimatedCostMin.toLocaleString()} - ${rfqData.estimatedCostMax.toLocaleString()}`
          : 'To be calculated',
        design_files_count: (rfqData.designFileUrls?.length || 0).toString(),
        to_email: emailjsToEmail,
        submission_date: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        templateParams,
        emailjsPublicKey
      );

      console.log('RFQ notification email sent successfully');
    } catch (error: any) {
      console.error('Error sending RFQ notification:', error);
      // Don't throw error here - RFQ submission should succeed even if email fails
    }
  }

  /**
   * Get RFQ submissions (admin only)
   */
  async getRFQSubmissions(limit: number = 50, offset: number = 0): Promise<RFQSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('rfq_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching RFQ submissions:', error);
        throw new Error('Failed to fetch RFQ submissions');
      }

      return data.map(this.mapDatabaseToRFQ);
    } catch (error: any) {
      console.error('Error in getRFQSubmissions:', error);
      throw error;
    }
  }

  /**
   * Update RFQ status (admin only)
   */
  async updateRFQStatus(rfqId: string, status: RFQSubmission['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('rfq_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', rfqId);

      if (error) {
        console.error('Error updating RFQ status:', error);
        throw new Error('Failed to update RFQ status');
      }
    } catch (error: any) {
      console.error('Error in updateRFQStatus:', error);
      throw error;
    }
  }

  /**
   * Map database record to RFQSubmission type
   */
  private mapDatabaseToRFQ(data: any): RFQSubmission {
    return {
      id: data.id,
      userName: data.user_name,
      userEmail: data.user_email,
      projectName: data.project_name,
      productCategory: data.product_category,
      sizeSpecifications: data.size_specifications,
      quantity: data.quantity,
      deadline: data.deadline,
      designFileUrls: data.design_file_urls || [],
      additionalNotes: data.additional_notes,
      estimatedCostMin: data.estimated_cost_min,
      estimatedCostMax: data.estimated_cost_max,
      currency: data.currency,
      status: data.status,
      sourceIp: data.source_ip,
      userAgent: data.user_agent,
      language: data.language,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// Export singleton instance
export const rfqService = RFQService.getInstance();
