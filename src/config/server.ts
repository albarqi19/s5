export const SERVER_CONFIG = {
  baseUrl: 'http://localhost:5000',
  endpoints: {
    students: '/api/students',
    records: '/api/records',
    teachers: '/api/teachers'
  }
} as const;