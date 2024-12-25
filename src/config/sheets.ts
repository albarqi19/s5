export const SHEETS_CONFIG = {
  ranges: {
    students: 'Students Data!A2:H',
    records: 'Record Data!A2:M',
    teachers: 'المعلمين!A2:C'
  }
} as const;

export type SheetRange = keyof typeof SHEETS_CONFIG.ranges;