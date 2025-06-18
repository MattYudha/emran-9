import { COMPANY_INFO, TIME } from './constants';

/**
 * Generate time-based greeting in Indonesian
 */
export function getTimeBasedGreeting(): string {
  const now = new Date();
  const jakartaTime = new Date(now.toLocaleString("en-US", { timeZone: COMPANY_INFO.TIMEZONE }));
  const hour = jakartaTime.getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'Selamat Pagi';
  } else if (hour >= 11 && hour < 15) {
    return 'Selamat Siang';
  } else if (hour >= 15 && hour < 18) {
    return 'Selamat Sore';
  } else {
    return 'Selamat Malam';
  }
}

/**
 * Check if current time is business hours
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const jakartaTime = new Date(now.toLocaleString("en-US", { timeZone: COMPANY_INFO.TIMEZONE }));
  const hour = jakartaTime.getHours();
  const day = jakartaTime.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Business hours: Monday-Friday 9AM-6PM, Saturday 10AM-2PM
  if (day >= 1 && day <= 5) { // Monday to Friday
    return hour >= 9 && hour < 18;
  } else if (day === 6) { // Saturday
    return hour >= 10 && hour < 14;
  }
  
  return false; // Sunday or outside business hours
}

/**
 * Generate session ID for analytics
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format currency in Indonesian Rupiah
 */
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${formatFileSize(maxSize)}.`
    };
  }
  
  return { valid: true };
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(message: string): string {
  const phoneNumber = COMPANY_INFO.DIRECT_CONTACT.PHONE.replace(/\D/g, ''); // Remove non-digits
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/62${phoneNumber.substring(1)}?text=${encodedMessage}`;
}

/**
 * Generate email URL with pre-filled content
 */
export function generateEmailUrl(subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${COMPANY_INFO.EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Detect user's preferred language from browser
 */
export function detectUserLanguage(): string {
  const browserLang = navigator.language || navigator.languages[0];
  
  if (browserLang.startsWith('id')) return 'id';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ar')) return 'ar';
  
  return 'en'; // Default to English
}

/**
 * Calculate reading time for text content
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get device info for analytics
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    isMobile: isMobileDevice()
  };
}
