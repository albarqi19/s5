import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// تحميل المتغيرات البيئية
dotenv.config();

// إنشاء مجلد للسجلات إذا لم يكن موجوداً
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// وظيفة لكتابة السجلات
function writeLog(message) {
  const logFile = path.join(logDir, 'sheets.log');
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage);
  console.log(message);
}

writeLog('=== تهيئة Google Sheets ===');

// التحقق من وجود المتغيرات البيئية المطلوبة
const requiredEnvVars = [
  'VITE_GOOGLE_SPREADSHEET_ID',
  'VITE_GOOGLE_CLIENT_EMAIL',
  'VITE_GOOGLE_PRIVATE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    writeLog(`خطأ: المتغير ${envVar} غير موجود`);
    process.exit(1);
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.VITE_GOOGLE_CLIENT_EMAIL,
    private_key: process.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
  ]
});

// إنشاء عميل Google Sheets
const sheets = google.sheets({ version: 'v4', auth });

// التحقق من الاتصال
async function checkConnection() {
  try {
    writeLog('\nجاري التحقق من الاتصال...');
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.VITE_GOOGLE_SPREADSHEET_ID,
      fields: 'sheets.properties.title,properties.title'
    });
    
    writeLog('\nتم الاتصال بنجاح!');
    writeLog(`عنوان الجدول: ${response.data.properties.title}`);
    writeLog(`الأوراق المتاحة: ${response.data.sheets.map(s => s.properties.title).join(', ')}`);
    
    return true;
  } catch (error) {
    writeLog('\nخطأ في الاتصال:');
    writeLog(`نوع الخطأ: ${error.name}`);
    writeLog(`رسالة الخطأ: ${error.message}`);
    if (error.response) {
      writeLog(`استجابة الخطأ: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// تنفيذ فحص الاتصال وانتظار النتيجة
writeLog('\nبدء فحص الاتصال...');
checkConnection().then(success => {
  if (success) {
    writeLog('=== تم إعداد Google Sheets بنجاح ===');
  } else {
    writeLog('=== فشل في إعداد Google Sheets ===');
    process.exit(1);
  }
});

export { sheets };
export const spreadsheetId = process.env.VITE_GOOGLE_SPREADSHEET_ID;
export { google };