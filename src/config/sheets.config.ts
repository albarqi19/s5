export const SHEETS_CONFIG = {
  credentials: {
    client_email: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
    private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID,
  ranges: {
    students: 'Students Data!A2:H',
    records: 'Record Data!A2:M',
    teachers: 'المعلمين!A2:C'
  }
} as const;