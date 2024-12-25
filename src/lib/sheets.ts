import { google } from 'googleapis';
import { SHEETS_CONFIG } from '../config/sheets';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
    private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

export async function fetchSheetData(range: keyof typeof SHEETS_CONFIG.ranges) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEETS_CONFIG.ranges[range],
      valueRenderOption: 'UNFORMATTED_VALUE'
    });

    if (!response.data.values) {
      throw new Error('لم يتم العثور على بيانات');
    }

    return response.data.values;
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    throw error;
  }
}