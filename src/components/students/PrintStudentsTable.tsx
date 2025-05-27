import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useThemeStore } from '../../store/themeStore';
import type { Student } from '../../types/student';
import { prepareForPrint, cleanupAfterPrint } from '../../utils/printHelper';

interface PrintStudentsTableProps {
  students: Student[];
  title?: string;
  levelFilter: string;
  onClose: () => void;
}

export function PrintStudentsTable({
  students,
  title = 'حلقات جامع الشيخ سعيد رداد رحمه الله',
  levelFilter,
  onClose
}: PrintStudentsTableProps) {
  const { isDark } = useThemeStore();
  const printRef = useRef<HTMLDivElement>(null);
  
  // رسالة عندما تكون قائمة الطلاب فارغة
  const isEmpty = students.length === 0;
  
  // ترتيب الطلاب حسب النقاط من الأعلى إلى الأدنى
  const sortedStudents = [...students].sort((a, b) => (b.points || 0) - (a.points || 0));
    // تاريخ اليوم
  const today = new Date().toLocaleDateString('ar-SA');

  // تحسين مكتبة الطباعة مع إعدادات إضافية لمنع التداخل
  const handlePrint = useReactToPrint({
    documentTitle: 'قائمة-الطلاب-' + (levelFilter || 'جميع-الحلقات'),
    onAfterPrint: onClose,
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      
      @media print {
        html, body {
          height: auto !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        table { page-break-inside: auto !important; }
        tr { page-break-inside: avoid !important; page-break-after: auto !important; }
        thead { display: table-header-group !important; }
        tfoot { display: table-footer-group !important; }
        
        /* إصلاح مشكلة القطع والتداخل */
        .print-container {
          position: static !important;
          overflow: visible !important;
          width: 100% !important;
          height: auto !important;
          break-inside: auto !important;
          page-break-before: auto !important;
          display: block !important;
        }
      }
    `,    // @ts-ignore - الخاصية content موجودة في المكتبة
    content: () => printRef.current
  });
    
  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAfterPrint();
    };
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}>
      <div className={`w-[210mm] max-h-[90vh] rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ overflow: 'auto' }}>
        {/* رأس المربع الحواري */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center no-print`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            معاينة قبل الطباعة {students.length > 0 ? `(${students.length} طالب)` : ''}
          </h2>
          <div className="flex gap-2">            <button              onClick={() => {
                // استخدم setTimeout للتأكد من أن الطباعة تعمل حتى مع تحميل الصفحة
                setTimeout(() => {
                  try {
                    // تحضير الطباعة باستخدام الأداة المساعدة
                    prepareForPrint(printRef);
                    handlePrint();
                  } catch (error) {
                    console.error('خطأ في الطباعة:', error);
                    // إذا فشلت الطباعة عبر المكتبة، استخدم الطريقة التقليدية
                    prepareForPrint(printRef);
                    window.print();
                    setTimeout(cleanupAfterPrint, 1000);
                  }
                }, 300);
              }}
              className={`px-4 py-2 rounded-md font-medium ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              طباعة
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
            >
              إغلاق
            </button>
          </div>
        </div>
        
        {/* محتوى الطباعة */}        <div className="p-6">          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg no-print">
            <h4 className="font-bold mb-1">نصائح للطباعة:</h4>
            <ul className="list-disc list-inside text-sm">
              <li>للحصول على نتائج أفضل، استخدم متصفح Chrome للطباعة</li>
              <li>تأكد من تحديد خيار "طباعة الخلفيات" في إعدادات الطباعة</li>
              <li>اضبط الهوامش على "بلا" للحصول على طباعة أكمل</li>
              <li>تأكد من تفعيل خيار "طباعة العناصر الرسومية" في إعدادات الطباعة</li>
              <li>قم بتحديد "كل الصفحات" في إعدادات نطاق الطباعة (وليس "الصفحة الحالية")</li>
            </ul>
          </div><div className="overflow-visible print-wrapper">
            <div ref={printRef} className="print-container w-full bg-white text-black p-8">
              {/* العنوان والمعلومات */}
              <div className="text-center mb-8 print-header">
                <h1 className="text-3xl font-bold" style={{ marginBottom: '10px' }}>{title}</h1>
                <h2 className="text-2xl font-bold mt-4" style={{ marginBottom: '10px' }}>قائمة الطلاب الأعلى نقاطاً</h2>
                {levelFilter && (
                  <h3 className="text-xl mt-3" style={{ marginBottom: '10px' }}>الحلقة: {levelFilter}</h3>
                )}
                <p className="mt-4 text-sm">تاريخ الطباعة: {today}</p>
              </div>
              
              {isEmpty ? (
                <div className="text-center py-10">
                  <p className="text-xl font-medium">لا توجد بيانات للطلاب</p>
                </div>
              ) : (                <table className="w-full border-collapse print-table" style={{ 
                  borderCollapse: 'collapse', 
                  width: '100%', 
                  border: '1px solid black',
                  tableLayout: 'fixed'
                }}>
                  <thead style={{ display: 'table-header-group' }}>
                    <tr style={{ borderBottom: '2px solid black', backgroundColor: '#f0f0f0' }}>
                      <th className="py-3 px-4 text-right" style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '15%' }}>الترتيب</th>
                      <th className="py-3 px-4 text-right" style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '45%' }}>اسم الطالب</th>
                      <th className="py-3 px-4 text-right" style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '25%' }}>الحلقة</th>
                      <th className="py-3 px-4 text-center" style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '15%' }}>النقاط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((student, index) => (
                      <tr key={student.id} style={{ 
                        borderBottom: '1px solid black', 
                        backgroundColor: index < 3 ? (index === 0 ? '#ffffc0' : index === 1 ? '#e6e6e6' : '#ffdab3') : (index % 2 === 0 ? '#f9f9f9' : 'transparent'),
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid'
                      }}>
                        <td className="py-3 px-4 text-right" style={{ border: '1px solid black', padding: '8px' }}>
                          {index < 3 ? (
                            <strong style={{ padding: '0 5px' }}>{index + 1}</strong>
                          ) : (
                            index + 1
                          )}
                        </td>
                        <td className="py-3 px-4 text-right" style={{ border: '1px solid black', padding: '8px' }}>{student.studentName}</td>
                        <td className="py-3 px-4 text-right" style={{ border: '1px solid black', padding: '8px' }}>{student.level}</td>
                        <td className="py-3 px-4 text-center font-bold" style={{ border: '1px solid black', padding: '8px' }}>{student.points}</td>
                      </tr>
                    ))}
                  </tbody>                  <tfoot style={{ display: 'table-footer-group' }}>
                    <tr>
                      <td colSpan={4} style={{ padding: '5px', height: '20px' }}>
                        <div className="text-center" style={{ fontSize: '10px', color: '#666' }}>
                          <p> نافس  © {new Date().getFullYear()}</p>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
