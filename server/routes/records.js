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
        // استخدام فهرس العمود الذي وجدناه بداية
        const pagesColumnToUse = pagesColumnIndex;
        
        // تحويل قيمة النقاط إلى رقم بشكل صحيح
        const pagesValue = parseInt(row[pagesColumnToUse]?.toString() || '0') || 0;
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

// تحديث صف محدد في ورقة Record Data (للمخالفات)
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
      // 1. الحصول على كل البيانات من ورقة Record Data للبحث عن صف فارغ
      console.log('Searching for empty row in Record Data sheet...');
      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Record Data!A:A',  // نحصل فقط على العمود A لنرى أين توجد الخلايا الفارغة
        valueRenderOption: 'FORMATTED_VALUE'
      });
      
      const columnAValues = dataResponse.data.values || [];
      let emptyRowIndex = -1;
      
      // البحث عن أول صف فارغ (القيمة فارغة في العمود A)
      for (let i = 0; i < columnAValues.length; i++) {
        // إذا كان الصف غير موجود أو فارغًا
        if (!columnAValues[i] || !columnAValues[i][0] || columnAValues[i][0].toString().trim() === '') {
          // الصفوف في Google Sheets تبدأ من 1، ونضيف 1 لأن الصف 1 هو للعناوين
          emptyRowIndex = i + 1; 
          break;
        }
      }
      
      // إذا لم نجد صفاً فارغاً، نضيف في نهاية الجدول
      if (emptyRowIndex === -1) {
        emptyRowIndex = columnAValues.length + 1; // الصف التالي بعد آخر صف
      }
      
      console.log(`Found empty row at index: ${emptyRowIndex}`);
      
      // 2. استخدام update لإدراج البيانات في الصف الفارغ المحدد
      const updateResponse = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Record Data!A${emptyRowIndex}:J${emptyRowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        }
      });
      
      console.log('Successfully updated row in Record Data. Response:', JSON.stringify(updateResponse.data, null, 2));
      
      res.json({
        message: 'تم تسجيل بيانات المخالفة بنجاح',
        updatedData: values,
        rowIndex: emptyRowIndex,
        sheetResponse: updateResponse.data
      });
      
    } catch (updateError) {
      console.error('Error updating Record Data sheet:', updateError);
      
      // في حالة فشل التحديث، نحاول استخدام ورقة "المخالفات" كخطة بديلة
      try {
        console.log('Trying to append to المخالفات sheet as fallback...');
        const appendResponse = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'المخالفات!A:J',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [values]
          }
        });
        
        console.log('Successfully appended data to المخالفات sheet. Response:', JSON.stringify(appendResponse.data, null, 2));
        
        res.json({
          message: 'تم تسجيل بيانات المخالفة بنجاح في ورقة المخالفات',
          updatedData: values,
          sheetResponse: appendResponse.data
        });
      } catch (appendError) {
        console.error('Error in sheets.spreadsheets.values.append to المخالفات sheet:', appendError);
        throw new Error(`فشلت إضافة البيانات بسبب حماية الخلايا في جدول البيانات. يرجى التواصل مع مالك جدول البيانات لإزالة الحماية أو منح صلاحيات الكتابة.`);
      }
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