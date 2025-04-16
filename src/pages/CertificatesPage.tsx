import React, { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useApi } from '../hooks/api/useApi';
import { useThemeStore } from '../store/themeStore';
import { CertificateCard } from '../components/certificates/CertificateCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AlertTriangle, Award, Printer } from '../components/icons';
import type { Student } from '../types/student';
import { CertificateTemplate } from '../components/certificates/CertificateTemplate';

export function CertificatesPage() {
  const { isDark } = useThemeStore();
  const { data: students = [], loading, error } = useApi<Student>('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyExcellent, setShowOnlyExcellent] = useState(true);
  
  // الطلاب المتميزين (أعلى من 80 نقطة)
  const excellentStudents = useMemo(() => {
    return students.filter(student => student.points >= 80);
  }, [students]);
  
  // الطلاب المرشحون للشهادات (بناء على التصفية)
  const eligibleStudents = useMemo(() => {
    let filteredStudents = showOnlyExcellent ? excellentStudents : students;
    
    if (searchTerm) {
      filteredStudents = filteredStudents.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parts.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredStudents.sort((a, b) => b.points - a.points);
  }, [students, excellentStudents, searchTerm, showOnlyExcellent]);

  const handlePrintCertificate = () => {
    if (!selectedStudent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة الشهادة');
      return;
    }
    
    printWindow.document.write('<html dir="rtl"><head><title>شهادة تقدير</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
      body {
        font-family: 'Tajawal', sans-serif;
        margin: 0;
        padding: 0;
      }
      .certificate-container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<div class="certificate-container">');
    
    // استدعاء مكون الشهادة وتمريره داخل نافذة الطباعة
    const certificateHtml = `
      <div style="width: 800px; height: 600px; border: 2px solid #d4af37; padding: 20px; text-align: center; background-color: #fffff0; position: relative;">
        <div style="position: absolute; top: 10px; right: 10px; left: 10px;">
          <img src="/mosque-logo.png" alt="شعار المسجد" style="height: 80px; margin-bottom: 10px;">
          <h1 style="color: #8b4513; font-size: 28px; margin-bottom: 15px;">شهادة تقدير</h1>
          <hr style="border: none; height: 1px; background-color: #d4af37; margin: 15px auto; width: 80%;">
        </div>
        
        <div style="margin-top: 150px; padding: 20px;">
          <p style="font-size: 18px; margin-bottom: 30px;">بسم الله الرحمن الرحيم</p>
          <p style="font-size: 20px; margin-bottom: 20px;">تشهد إدارة حلقات المسجد بأن الطالب</p>
          <h2 style="color: #8b4513; font-size: 32px; margin: 15px 0;">${selectedStudent.studentName}</h2>
          <p style="font-size: 20px;">قد أظهر تميزاً واجتهاداً في حفظ كتاب الله</p>
          <p style="font-size: 18px; margin-top: 15px;">وحصل على مجموع نقاط: <strong style="color: #8b4513;">${selectedStudent.points}</strong></p>
          <p style="font-size: 18px;">المستوى: <strong>${selectedStudent.parts}</strong> - الحلقة: <strong>${selectedStudent.level}</strong></p>
        </div>
        
        <div style="position: absolute; bottom: 30px; width: 100%; right: 0; left: 0;">
          <p style="font-size: 16px; font-style: italic;">نسأل الله أن يبارك له في علمه وأن ينفع به الإسلام والمسلمين</p>
          <hr style="border: none; height: 1px; background-color: #d4af37; margin: 15px auto; width: 50%;">
          <p style="font-size: 16px;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</p>
          
          <div style="display: flex; justify-content: space-between; margin: 0 100px;">
            <div>
              <p style="margin-bottom: 40px;">ختم الإدارة</p>
              <div style="width: 100px; height: 40px; margin: 0 auto;"></div>
            </div>
            <div>
              <p style="margin-bottom: 40px;">توقيع المشرف</p>
              <div style="width: 100px; height: 40px; margin: 0 auto;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    printWindow.document.write(certificateHtml);
    printWindow.document.write('</div></body></html>');
    
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className={`p-6 rounded-xl ${isDark ? 'bg-red-900/20 text-red-100' : 'bg-red-50 text-red-800'}`}>
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold text-center mb-2">حدث خطأ</h3>
            <p className="text-center">لم نتمكن من تحميل بيانات الطلاب</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="min-h-screen p-6 transition-all duration-300">
        {/* شهادة مختارة */}
        {selectedStudent && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4`}>
            <div className={`relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-auto max-h-screen`}>
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <CertificateTemplate student={selectedStudent} />
                
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    onClick={handlePrintCertificate}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Printer size={20} />
                    طباعة الشهادة
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* العنوان والبحث */}
        <div className={`mb-8 rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                شهادات الطلاب
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {excellentStudents.length} طالب متميز من أصل {students.length} طالب
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
              <svg
                className={`absolute right-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="flex items-center">
              <label className={`flex items-center gap-2 cursor-pointer ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={showOnlyExcellent}
                  onChange={(e) => setShowOnlyExcellent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>إظهار الطلاب المتميزين فقط (فوق 80 نقطة)</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* قائمة الطلاب */}
        {eligibleStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleStudents.map(student => (
              <CertificateCard
                key={student.id}
                student={student}
                onClick={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        ) : (
          <div className={`p-12 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Award className={`mx-auto h-16 w-16 mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              لا يوجد طلاب مؤهلين
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {showOnlyExcellent 
                ? 'لا يوجد طلاب متميزين حالياً. يمكنك إلغاء تحديد خيار "إظهار الطلاب المتميزين فقط" لعرض جميع الطلاب.'
                : 'لم يتم العثور على طلاب مطابقين لمعايير البحث.'}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}