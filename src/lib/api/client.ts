import { API_CONFIG } from '../../config/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(endpoint: keyof typeof API_CONFIG.endpoints): Promise<T[]> {
    try {
      const url = `${this.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`خطأ في الاتصال: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data) {
        throw new Error('لم يتم العثور على بيانات');
      }
      
      return data;
    } catch (error) {
      console.error(`خطأ في جلب البيانات من ${endpoint}:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_CONFIG.baseUrl);