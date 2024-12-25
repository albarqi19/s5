export interface Teacher {
  id: string;
  name: string;         // NAME
  limit: number;        // الحد
  used: number;         // المستخدم
  remaining: number;    // المتبقي
  number: string;       // الرقم
  points?: number;      // مجموع النقاط المضافة (من سجلات الطلاب)
}
