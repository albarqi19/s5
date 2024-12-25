import express from 'express';
import { sheets, spreadsheetId } from '../config/sheets.js';

const router = express.Router();

// الحصول على جميع الطلاب
router.get('/', async (req, res) => {
  console.log('GET /api/students - Start');
  try {
    console.log('Fetching from Google Sheets...');
    const { level, currentLevel } = req.query;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Students Data!A2:I',
      valueRenderOption: 'UNFORMATTED_VALUE'
    });
    
    console.log('Processing data...');
    const rows = response.data.values || [];
    let students = rows.map((row, index) => ({
      rowIndex: index + 2,
      id: row[0]?.toString() || '',
      studentName: row[1]?.toString() || '',
      level: row[2]?.toString() || '',
      classNumber: row[3]?.toString() || '',
      violations: row[4]?.toString() || '',
      parts: row[5]?.toString() || '',
      points: parseInt(row[6]?.toString() || '0'),
      phone: row[7]?.toString() || '',
      currentLevel: row[8]?.toString() || ''
    }));

    if (level) {
      students = students.filter(student => student.level === level);
    }

    if (currentLevel) {
      students = students.filter(student => student.currentLevel === currentLevel);
    }

    students.sort((a, b) => b.points - a.points);
    
    console.log(`Sending ${students.length} students`);
    res.json(students);
  } catch (error) {
    console.error('Error in GET /api/students:', error);
    res.status(500).json({ 
      error: 'Failed to fetch students',
      details: error.message 
    });
  }
});

// إضافة طالب جديد
router.post('/', async (req, res) => {
  try {
    const { id, studentName, level, classNumber, phone } = req.body;

    if (!id || !studentName || !level || !classNumber || !phone) {
      return res.status(400).json({
        error: 'بيانات مفقودة',
        details: 'جميع الحقول مطلوبة'
      });
    }

    const values = [
      id,
      studentName,
      level,
      classNumber,
      '',  // المخالفات
      '',  // الأجزاء
      '0',  // النقاط
      phone,
      ''   // المستوى الحالي
    ];

    console.log('Adding student...', {
      id,
      studentName,
      level,
      classNumber,
      phone
    });

    // إضافة البيانات في ورقة Students Data
    const mainResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Students Data!A:I',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values]
      }
    });

    console.log('Student added to main sheet');

    // إضافة البيانات في ورقة الحلقة
    const levelResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${level}'!A:I`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values]
      }
    });

    console.log('Student added to level sheet');

    res.status(201).json({ 
      message: 'تم إضافة الطالب بنجاح',
      data: { id, studentName, level, classNumber, phone }
    });

  } catch (error) {
    console.error('Error adding student:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    res.status(500).json({ 
      error: 'فشل في إضافة الطالب',
      details: error.message,
      apiError: error.response?.data
    });
  }
});

// تحديث بيانات الطالب
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const { phone, level } = req.body;
    console.log('Updating student:', { studentId, phone, level });

    // 1. البحث عن الطالب في الورقة الرئيسية
    const mainResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Students Data!A2:I',
      valueRenderOption: 'UNFORMATTED_VALUE'
    });

    const rows = mainResponse.data.values || [];
    const studentIndex = rows.findIndex(row => {
      const rowId = row[0]?.toString().trim();
      return rowId === studentId.toString().trim();
    });
    
    if (studentIndex === -1) {
      return res.status(404).json({
        error: 'الطالب غير موجود',
        details: `لم يتم العثور على طالب برقم ${studentId}`
      });
    }

    const oldLevel = rows[studentIndex][2]?.toString();
    const mainRowNumber = studentIndex + 2; // +2 لأن الصف الأول هو العناوين

    // 2. تحديث البيانات في الورقة الرئيسية
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Students Data!C${mainRowNumber}:H${mainRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          level,
          rows[studentIndex][3] || '',  // classNumber
          rows[studentIndex][4] || '',  // violations
          rows[studentIndex][5] || '',  // parts
          rows[studentIndex][6] || '',  // points
          phone
        ]]
      }
    });

    console.log('Student updated in main sheet');

    // 3. إذا تغيرت الحلقة، نقوم بنقل الطالب
    if (oldLevel !== level) {
      // 3.1 حذف الطالب من الحلقة القديمة
      const oldLevelResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${oldLevel}'!A2:I`,
        valueRenderOption: 'UNFORMATTED_VALUE'
      });

      const oldLevelRows = oldLevelResponse.data.values || [];
      const oldLevelIndex = oldLevelRows.findIndex(row => {
        const rowId = row[0]?.toString().trim();
        return rowId === studentId.toString().trim();
      });

      if (oldLevelIndex !== -1) {
        const sheetsResponse = await sheets.spreadsheets.get({
          spreadsheetId
        });
        
        const oldLevelSheet = sheetsResponse.data.sheets.find(
          sheet => sheet.properties.title === oldLevel
        );

        if (oldLevelSheet) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
              requests: [{
                deleteDimension: {
                  range: {
                    sheetId: oldLevelSheet.properties.sheetId,
                    dimension: 'ROWS',
                    startIndex: oldLevelIndex + 1,
                    endIndex: oldLevelIndex + 2
                  }
                }
              }]
            }
          });
          console.log('Student deleted from old level sheet');
        }
      }

      // 3.2 إضافة الطالب في الحلقة الجديدة
      const values = [
        rows[studentIndex][0],  // id
        rows[studentIndex][1],  // studentName
        level,
        rows[studentIndex][3],  // classNumber
        rows[studentIndex][4],  // violations
        rows[studentIndex][5],  // parts
        rows[studentIndex][6],  // points
        phone,
        rows[studentIndex][8]   // currentLevel
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `'${level}'!A:I`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [values]
        }
      });

      console.log('Student added to new level sheet');
    } else {
      // 3.3 تحديث البيانات في نفس الحلقة
      const levelResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${level}'!A2:I`,
        valueRenderOption: 'UNFORMATTED_VALUE'
      });

      const levelRows = levelResponse.data.values || [];
      const levelIndex = levelRows.findIndex(row => {
        const rowId = row[0]?.toString().trim();
        return rowId === studentId.toString().trim();
      });

      if (levelIndex !== -1) {
        const levelRowNumber = levelIndex + 2;
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${level}'!C${levelRowNumber}:H${levelRowNumber}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[
              level,
              rows[studentIndex][3] || '',  // classNumber
              rows[studentIndex][4] || '',  // violations
              rows[studentIndex][5] || '',  // parts
              rows[studentIndex][6] || '',  // points
              phone
            ]]
          }
        });
        console.log('Student updated in level sheet');
      }
    }

    res.json({ 
      message: 'تم تحديث بيانات الطالب بنجاح',
      studentId
    });

  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ 
      error: 'فشل في تحديث بيانات الطالب',
      details: error.message 
    });
  }
});

// حذف طالب
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('Deleting student with ID:', studentId);

    // 1. البحث عن الطالب في الورقة الرئيسية
    const mainResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Students Data!A2:I',
      valueRenderOption: 'UNFORMATTED_VALUE'
    });

    const rows = mainResponse.data.values || [];
    const studentIndex = rows.findIndex(row => {
      const rowId = row[0]?.toString().trim();
      return rowId === studentId.toString().trim();
    });
    
    if (studentIndex === -1) {
      return res.status(404).json({
        error: 'الطالب غير موجود',
        details: `لم يتم العثور على طالب برقم ${studentId}`
      });
    }

    const studentLevel = rows[studentIndex][2]?.toString();
    const mainRowNumber = studentIndex + 2; // +2 لأن الصف الأول هو العناوين

    // 2. الحصول على معرف الورقة الرئيسية
    const sheetsResponse = await sheets.spreadsheets.get({
      spreadsheetId
    });
    
    const mainSheet = sheetsResponse.data.sheets.find(
      sheet => sheet.properties.title === 'Students Data'
    );

    if (!mainSheet) {
      throw new Error('لم يتم العثور على الورقة الرئيسية');
    }

    // 3. حذف الطالب من الورقة الرئيسية
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: mainSheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: mainRowNumber - 1,
              endIndex: mainRowNumber
            }
          }
        }]
      }
    });

    console.log('Student deleted from main sheet');

    // 4. البحث عن الطالب في ورقة الحلقة
    if (studentLevel) {
      const levelResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${studentLevel}'!A2:I`,
        valueRenderOption: 'UNFORMATTED_VALUE'
      });

      const levelRows = levelResponse.data.values || [];
      const levelIndex = levelRows.findIndex(row => {
        const rowId = row[0]?.toString().trim();
        return rowId === studentId.toString().trim();
      });

      if (levelIndex !== -1) {
        const levelSheet = sheetsResponse.data.sheets.find(
          sheet => sheet.properties.title === studentLevel
        );

        if (levelSheet) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
              requests: [{
                deleteDimension: {
                  range: {
                    sheetId: levelSheet.properties.sheetId,
                    dimension: 'ROWS',
                    startIndex: levelIndex + 1,
                    endIndex: levelIndex + 2
                  }
                }
              }]
            }
          });
          console.log('Student deleted from level sheet');
        }
      }
    }

    res.json({ 
      message: 'تم حذف الطالب بنجاح',
      studentId
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      error: 'فشل في حذف الطالب',
      details: error.message 
    });
  }
});

export default router;