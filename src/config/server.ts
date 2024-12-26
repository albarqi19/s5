const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://your-app-name.onrender.com';
  }
  return 'http://localhost:5000';
};

export const SERVER_CONFIG = {
  baseUrl: getBaseUrl(),
  endpoints: {
    students: '/api/students',
    records: '/api/records',
    teachers: '/api/teachers'
  }
} as const;