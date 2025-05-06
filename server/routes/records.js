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
        // تحويل قيمة النقاط إلى رقم بشكل صحيح
        const pagesValue = parseInt(row[3]?.toString() || '0') || 0;
        console.log('Points value from sheet:', pagesValue);
        
        // تحويل قيمة إجمالي النقاط إلى رقم بشكل صحيح (إذا كانت موجودة)
        let totalPointsValue = 0;
        if (row[10] && row[10].toString().trim() !== '') {
          totalPointsValue = parseInt(row[10].toString()) || 0;
          console.log('Total points value from sheet:', totalPointsValue);
        }
        
        return {
          id: row[0]?.toString() || '',
          studentId: row[1]?.toString() || '',
          studentName: row[2]?.toString() || '',
          pages: pagesValue,  
          reason: row[4]?.toString() || '',
          teacher: row[5]?.toString() || '',
          dateTime: row[6]?.toString() || '',
          date: row[7]?.toString() || '',
          phoneNumber: row[8]?.toString() || '',
          teacherName: row[9]?.toString() || '',
          totalPoints: totalPointsValue,
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

// البحث عن الصفوف الفارغة في ورقة Record Data - نحتفظ بها للتوافق مع الكود الحالي
router.get('/find-empty-rows', async (req, res) => {
  try {
    // بدلاً من البحث عن صفوف فارغة، سنعيد دائماً قيمة "append" لتشير إلى أننا سنضيف في النهاية
    res.json({ 
      emptyRowIndex: "append", 
      message: "سيتم إضافة المخالفة في نهاية الجدول لتجنب مشكلة الخلايا المحمية" 
    });
  } catch (error) {
    console.error('Error finding empty rows:', error);
    res.status(500).json({ 
      error: 'Failed to find empty rows',
      details: error.message 
    });
  }
});

// تحديث صف محدد في ورقة Record Data (للمخالفات) - تم تعديله لاستخدام append
router.post('/update-row', async (req, res) => {
  try {
    const { rowIndex, violationData } = req.body;
    
    console.log('Received request to update row with violation data:');
    console.log('Row Index:', rowIndex);
    console.log('Violation Data:', JSON.stringify(violationData, null, 2));
    
    if (!violationData) {
      console.error('Error: Missing violation data');
      return res.status(400).json({
        error: 'بيانات مفقودة',
        details: 'يجب توفير بيانات المخالفة'
      });
    }
    
    // التحقق من وجود البيانات الضرورية
    if (!violationData.studentId || !violationData.studentName) {
      console.error('Error: Missing required violation data fields');
      return res.status(400).json({
        error: 'بيانات غير مكتملة',
        details: 'يجب توفير معرف الطالب واسمه'
      });
    }
    
    // تحويل النقاط إلى تنسيق مناسب (إذا كانت قيمة نصية)
    let points = violationData.points;
    if (typeof points === 'string') {
      points = points.trim();
      // التأكد من أن قيمة النقاط صحيحة
      if (!/^-?\d+$/.test(points)) {
        console.error('Error: Invalid points value:', points);
        points = '-5'; // قيمة افتراضية
      }
    }
    
    console.log('Processed points value:', points);
    
    // تحضير البيانات للإدخال في الصف (الأعمدة من A إلى J)
    const values = [
      violationData.id || '', // A: معرف السجل
      violationData.studentId || '', // B: معرف الطالب
      violationData.studentName || '', // C: اسم الطالب
      points || '', // D: النقاط (سالبة)
      violationData.reason || '', // E: نوع المخالفة
      violationData.teacherId || '', // F: معرف المعلم
      violationData.time || '', // G: الوقت
      violationData.date || '', // H: التاريخ
      violationData.phoneNumber || '', // I: رقم الهاتف
      violationData.teacherName || '', // J: اسم المعلم
    ];
    
    console.log('Prepared values for sheet:', values);
    
    try {
      // تصحيح تنسيق النطاق - استخدام "Record Data!A:J" بدلاً من استخدام كلمة "append" في النطاق
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Record Data!A:J', // تنسيق نطاق صحيح بدون كلمة append
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [values]
        }
      });
      
      console.log('Successfully appended data. Response:', JSON.stringify(appendResponse.data, null, 2));
      
      res.json({
        message: 'تم تسجيل بيانات المخالفة بنجاح',
        updatedData: values,
        sheetResponse: appendResponse.data
      });
    } catch (appendError) {
      console.error('Error in sheets.spreadsheets.values.append:', appendError);
      
      // معلومات تفصيلية عن الخطأ للمساعدة في التشخيص
      let errorDetails = appendError.message;
      if (appendError.response) {
        errorDetails += ` | Status: ${appendError.response.status}`;
        if (appendError.response.data && appendError.response.data.error) {
          const error = appendError.response.data.error;
          errorDetails += ` | Reason: ${error.message || error.reason || JSON.stringify(error)}`;
        }
      }
      
      throw new Error(`Failed to append data to spreadsheet: ${errorDetails}`);
    }
  } catch (error) {
    console.error('Error in /update-row route:', error);
    res.status(500).json({ 
      error: 'فشل تحديث بيانات المخالفة',
      details: error.message 
    });
  }
});

export default router;