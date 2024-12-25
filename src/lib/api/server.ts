import { SERVER_CONFIG } from '../../config/server';

class ServerApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(endpoint: keyof typeof SERVER_CONFIG.endpoints): Promise<T[]> {
    try {
      const response = await fetch(`${this.baseUrl}${SERVER_CONFIG.endpoints[endpoint]}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }
}

export const serverApi = new ServerApi(SERVER_CONFIG.baseUrl);