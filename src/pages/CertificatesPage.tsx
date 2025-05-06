import React, { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useApi } from '../hooks/api/useApi';
import { useThemeStore } from '../store/themeStore';
import { CertificateCard } from '../components/certificates/CertificateCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AlertTriangle, Award, Download, Printer } from '../components/icons';
import type { Student } from '../types/student';
import { CertificateTemplate } from '../components/certificates/CertificateTemplate';
import { CertificateSelector, type CertificateDesign } from '../components/certificates/CertificateSelector';

export function CertificatesPage() {
  const { isDark } = useThemeStore();
  const { data: students = [], loading, error } = useApi<Student>('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyExcellent, setShowOnlyExcellent] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<CertificateDesign>('classic');
  
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

  // تلقائياً اختيار التصميم المميز للطلاب المتفوقين (فوق 90 نقطة)
  useMemo(() => {
    if (selectedStudent && selectedStudent.points >= 90 && selectedDesign === 'classic') {
      setSelectedDesign('premium');
    }
  }, [selectedStudent]);

  // طباعة الشهادة
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
      @page {
        size: A4 landscape;
        margin: 0;
      }
      body {
        font-family: 'Tajawal', sans-serif;
        margin: 0;
        padding: 0;
        color: #000;
        background-color: white;
      }
      .certificate-container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /* ضمان ظهور جميع العناصر بوضوح عند الطباعة */
      * {
        color: #000 !important;
        text-shadow: none !important;
        box-shadow: none !important;
      }
      /* تحسين ظهور العناصر الشفافة */
      .opacity-10, .opacity-5 {
        opacity: 0.2 !important;
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<div id="certificate-container"></div>');
    
    // استخدام React لعرض الشهادة بدلاً من HTML ثابت
    import('react-dom/client').then((ReactDOM) => {
      const root = ReactDOM.createRoot(printWindow.document.getElementById('certificate-container') as HTMLElement);
      root.render(<CertificateTemplate student={selectedStudent} design={selectedDesign} />);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    });
  };

  // تصدير الشهادة كصورة (باستخدام html2canvas)
  const handleExportAsPNG = () => {
    if (!selectedStudent) return;
    
    // التأكد من وجود html2canvas
    if (typeof window.html2canvas === 'undefined') {
      // لو لم تكن المكتبة موجودة، يتم استدعاؤها
      const script = document.createElement('script');
      script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
      script.onload = executeExport;
      document.head.appendChild(script);
    } else {
      executeExport();
    }
    
    // تنفيذ التصدير
    function executeExport() {
      const certificateElement = document.querySelector('.certificate-content') as HTMLElement;
      if (!certificateElement) return;
      
      window.html2canvas(certificateElement, { 
        scale: 2, 
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        useCORS: true
      }).then(canvas => {
        // تحويل Canvas إلى رابط تحميل
        const link = document.createElement('a');
        link.download = `شهادة_${selectedStudent?.studentName.replace(/ /g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
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
            <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full overflow-auto max-h-[90vh]`}>
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {/* اختيار تصميم الشهادة */}
                <CertificateSelector 
                  selectedDesign={selectedDesign}
                  onSelectDesign={setSelectedDesign}
                />
                
                {/* معاينة الشهادة */}
                <div className={`border rounded-xl p-4 mb-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <CertificateTemplate student={selectedStudent} design={selectedDesign} />
                </div>
                
                {/* أزرار العمليات */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrintCertificate}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <Printer size={20} />
                    طباعة الشهادة
                  </button>
                  
                  <button
                    onClick={handleExportAsPNG}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    <Download size={20} />
                    تنزيل كصورة
                  </button>
                  
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

// إضافة نوع html2canvas لتجنب أخطاء TypeScript
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}