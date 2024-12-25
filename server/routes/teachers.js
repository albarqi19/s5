import express from 'express';
import { sheets, spreadsheetId } from '../config/sheets.js';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('Received request for teachers');
  try {
    console.log('Fetching teachers data from spreadsheet...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'المعلمين!A2:E',  // تمديد النطاق ليشمل العمود E
      valueRenderOption: 'FORMATTED_VALUE'  // تغيير لقراءة القيم كما تظهر في الجدول
    });
    
    if (!response.data.values) {
      console.log('No teachers data found');
      throw new Error('لم يتم العثور على بيانات المعلمين');
    }

    // طباعة البيانات الخام
    console.log('Raw response:', JSON.stringify(response.data.values, null, 2));

    console.log('Processing teachers data...');
    const teachers = response.data.values.map((row, index) => {
      // طباعة البيانات الخام لكل صف
      console.log(`Row ${index} raw data:`, row);
      
      // تحويل النقاط إلى رقم
      const pointsValue = row[3]; // العمود D
      console.log(`Points value for row ${index}:`, pointsValue, typeof pointsValue);
      
      const teacher = {
        id: row[0]?.toString() || '',
        name: row[1]?.toString() || '',
        points: pointsValue ? Number(pointsValue) : 0,  // تحويل القيمة إلى رقم
        limit: row[4] ? Number(row[4]) : 0
      };
      
      console.log(`Processed teacher ${index}:`, teacher);
      return teacher;
    });

    console.log('Final teachers data:', JSON.stringify(teachers, null, 2));
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch teachers data',
      details: error.message 
    });
  }
});

export default router;