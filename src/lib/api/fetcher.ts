import { API_ENDPOINTS, type ApiEndpoint } from './endpoints';

export async function fetchFromApi<T>(endpoint: ApiEndpoint): Promise<T[]> {
  try {
    const response = await fetch(API_ENDPOINTS[endpoint]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}