import express from 'express';
import { sheets, spreadsheetId } from '../config/sheets.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching records data...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Record Data!A2:M',
      valueRenderOption: 'FORMATTED_VALUE'
    });
    
    const rows = response.data.values || [];
    console.log('Processing records data...');
    const records = rows
      .filter(row => row[7] && row[7].toString().trim() !== '') 
      .map(row => {
        const pointsValue = row[3]?.toString() || '0';
        console.log('Points value from sheet:', pointsValue);
        
        return {
          id: row[0]?.toString() || '',
          studentId: row[1]?.toString() || '',
          studentName: row[2]?.toString() || '',
          points: pointsValue,  
          reason: row[4]?.toString() || '',
          teacher: row[5]?.toString() || '',
          dateTime: row[6]?.toString() || '',
          date: row[7]?.toString() || '',
          phoneNumber: row[8]?.toString() || '',
          teacherName: row[9]?.toString() || '',
          totalPoints: row[10]?.toString() || '',
          level: row[11]?.toString() || '',
          badge: row[12]?.toString() || ''
        };
      });

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