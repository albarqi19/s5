// أدوات مساعدة للطباعة
import { RefObject } from 'react';

/**
 * تحضير الطباعة بتهيئة عناصر الصفحة
 * @param printRef المرجع لعنصر الطباعة
 */
export function prepareForPrint(printRef: RefObject<HTMLElement | null>): void {
  // إضافة الصنف للجسم
  document.body.classList.add('printing-students');
  
  // تهيئة حاوية الطباعة للعرض الكامل
  if (printRef.current) {
    // إزالة أي قيود على الارتفاع أو التمرير
    printRef.current.style.maxHeight = 'none';
    printRef.current.style.height = 'auto';
    printRef.current.style.overflow = 'visible';
    
    // تأكد من عرض كل الجدول بالكامل
    const table = printRef.current.querySelector('table');
    if (table) {
      table.style.pageBreakInside = 'auto';
      table.style.breakInside = 'auto';
    }
    
    // تأكد من عدم انقسام الصفوف
    const rows = printRef.current.querySelectorAll('tbody tr');
    rows.forEach(row => {
      (row as HTMLElement).style.pageBreakInside = 'avoid';
      (row as HTMLElement).style.breakInside = 'avoid';
    });
  }
}

/**
 * تنظيف بعد الطباعة
 */
export function cleanupAfterPrint(): void {
  document.body.classList.remove('printing-students');
}
