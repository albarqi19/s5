import { API_CONFIG } from '../config/api';

export async function fetchData<T>(endpoint: keyof typeof API_CONFIG.endpoints): Promise<T[]> {
  try {
    const url = `${API_CONFIG.baseUrl}/${API_CONFIG.endpoints[endpoint]}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}