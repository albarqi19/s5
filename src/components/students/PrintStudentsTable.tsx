import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useThemeStore } from '../../store/themeStore';
import type { Student } from '../../types/student';

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
    const handlePrint = useReactToPrint({
    documentTitle: 'قائمة-الطلاب-' + (levelFilter || 'جميع-الحلقات'),
    onAfterPrint: onClose,
    // @ts-ignore - الخاصية content موجودة في المكتبة لكنها غير معرفة في التعريفات
    content: () => printRef.current
  });
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}>
      <div className={`w-[210mm] max-h-[90vh] rounded-lg shadow-xl overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* رأس المربع الحواري */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            معاينة قبل الطباعة
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
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
        
        {/* محتوى الطباعة */}
        <div className="p-6">
          <div className="overflow-hidden">
            <div ref={printRef} className="print-container w-full bg-white text-black p-8">
              {/* العنوان والمعلومات */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">{title}</h1>
                <h2 className="text-xl mt-2">قائمة الطلاب الأعلى نقاطاً</h2>
                {levelFilter && (
                  <h3 className="text-lg mt-1">الحلقة: {levelFilter}</h3>
                )}
                <p className="mt-2 text-sm">تاريخ الطباعة: {today}</p>
              </div>
              
              {isEmpty ? (
                <div className="text-center py-10">
                  <p className="text-xl font-medium">لا توجد بيانات للطلاب</p>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-800">
                      <th className="py-3 text-right">الترتيب</th>
                      <th className="py-3 text-right">اسم الطالب</th>
                      <th className="py-3 text-right">الحلقة</th>
                      <th className="py-3 text-center">النقاط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((student, index) => (
                      <tr key={student.id} className="border-b border-gray-300">
                        <td className="py-3 text-right">{index + 1}</td>
                        <td className="py-3 text-right">{student.studentName}</td>
                        <td className="py-3 text-right">{student.level}</td>
                        <td className="py-3 text-center font-bold">{student.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
