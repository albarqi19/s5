export const API_CONFIG = {
  baseUrl: 'http://localhost:5000',
  endpoints: {
    students: '/api/students',
    records: '/api/records', 
    teachers: '/api/teachers'
  }
} as const;

export type ApiEndpoint = keyof typeof API_CONFIG.endpoints;