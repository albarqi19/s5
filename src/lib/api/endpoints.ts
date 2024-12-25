export const API_ENDPOINTS = {
  students: '/api/students',
  records: '/api/records',
  teachers: '/api/teachers'
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;