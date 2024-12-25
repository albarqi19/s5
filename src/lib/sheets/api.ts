import { sheets, spreadsheetId } from './client';
import { SHEETS_CONFIG, type SheetRange } from '../../config/sheets';

export async function fetchSheetData(range: SheetRange) {
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