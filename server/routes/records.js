import express from 'express';
import { sheets, spreadsheetId } from '../config/sheets.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching records data...');
    
    // أولاً: الحصول على رؤوس الأعمدة للتعرف على موقع عمود "Pages"
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Record Data!A1:M1',
      valueRenderOption: 'FORMATTED_VALUE'
    });
    
    const headers = headerResponse.data.values ? headerResponse.data.values[0] : [];
    console.log('Sheet headers:', headers);
    
    // البحث عن فهرس عمود النقاط/الصفحات
    let pagesColumnIndex = 3; // الافتراضي هو العمود الرابع (index 3)
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'Pages') {
        pagesColumnIndex = i;
        console.log('Found Pages column at index:', pagesColumnIndex);
        break;
      }
    }
    
    // الآن نقوم بجلب البيانات
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Record Data!A2:M',
      valueRenderOption: 'FORMATTED_VALUE'
    });
    
    const rows = response.data.values || [];
    console.log('Processing records data...');
    
    // طباعة البيانات الخام من الورقة للتحقق
    console.log('Raw data from sheet (first row):', rows.length > 0 ? rows[0] : 'No data');
    
    if (rows.length > 0) {
      console.log('Pages column (index ' + pagesColumnIndex + ') sample values:');
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        console.log(`Row ${i + 1}: [${rows[i][pagesColumnIndex]}]`);
      }
    }
    
    const records = rows
      .filter(row => row[7] && row[7].toString().trim() !== '') 
      .map(row => {
<<<<<<< HEAD
        // استخدام فهرس العمود الذي وجدناه، أو العودة إلى الإصدار الاحتياطي
        const pointsValue = row[pagesColumnIndex] !== undefined && row[pagesColumnIndex] !== null 
          ? row[pagesColumnIndex].toString() 
          : '0';
          
        console.log('Points value from sheet:', pointsValue);
=======
        // تحويل قيمة الصفحات إلى رقم
        const pagesValue = parseInt(row[3]?.toString() || '0') || 0;
        console.log('Pages value from sheet:', pagesValue);
>>>>>>> b3b24f90435c48500ce94437720dee9f324b36a6
        
        return {
          id: row[0]?.toString() || '',
          studentId: row[1]?.toString() || '',
          studentName: row[2]?.toString() || '',
<<<<<<< HEAD
          pages: pointsValue,
=======
          pages: pagesValue,  
>>>>>>> b3b24f90435c48500ce94437720dee9f324b36a6
          reason: row[4]?.toString() || '',
          teacher: row[5]?.toString() || '',
          dateTime: row[6]?.toString() || '',
          date: row[7]?.toString() || '',
          phoneNumber: row[8]?.toString() || '',
          teacherName: row[9]?.toString() || '',
          totalPoints: parseInt(row[10]?.toString() || '0') || 0,
          level: row[11]?.toString() || '',
          badge: row[12]?.toString() || ''
        };
      });

    // نطبع البيانات المعالجة قبل إرسالها
    if (records.length > 0) {
      console.log('Processed data example:');
      console.log('First record:', JSON.stringify(records[0]));
      console.log('Pages value in first record:', records[0].pages);
    }

    console.log('Sending records data:', records.length, 'records');
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch records data',
      details: error.message 
    });
  }
});

export default router;