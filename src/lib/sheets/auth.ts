import { google } from 'googleapis';
import { SHEETS_CONFIG } from '../../config/sheets.config';

// إنشاء مصادقة Google
export const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: SHEETS_CONFIG.credentials.client_email,
    private_key: SHEETS_CONFIG.credentials.private_key
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

// إنشاء عميل Google Sheets
export const sheets = google.sheets({ version: 'v4', auth });