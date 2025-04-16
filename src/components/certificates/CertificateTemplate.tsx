import React from 'react';
import type { Student } from '../../types/student';
import { useThemeStore } from '../../store/themeStore';
import type { CertificateDesign } from './CertificateSelector';

interface CertificateTemplateProps {
  student: Student;
  design: CertificateDesign;
}

export function CertificateTemplate({ student, design = 'classic' }: CertificateTemplateProps) {
  const { isDark } = useThemeStore();
  
  // ضمان ظهور النص بوضوح في وضع الظلام
  const textColorClass = isDark ? 'print:text-gray-900' : '';
  
  // اختيار التصميم المناسب بناء على الخيار المحدد
  const renderCertificateByDesign = () => {
    switch (design) {
      case 'modern':
        return renderModernDesign();
      case 'premium':
        return renderPremiumDesign();
      case 'simple':
        return renderSimpleDesign();
      case 'classic':
      default:
        return renderClassicDesign();
    }
  };
  
  // التصميم الكلاسيكي (الأصلي)
  const renderClassicDesign = () => (
    <div className={`certificate-content w-full max-w-4xl border-4 border-yellow-600 p-8 bg-yellow-50 text-center relative ${textColorClass}`}>
      {/* الشعار */}
      <div className="absolute top-5 right-5">
        <img src="/mosque-logo.png" alt="شعار المسجد" className="h-20" />
      </div>
      
      <div className="absolute top-5 left-5">
        <img src="/nafes-logo.png" alt="شعار نافس" className="h-20" />
      </div>
      
      {/* العنوان */}
      <div className="mt-6 pt-10">
        <h1 className="text-3xl font-bold text-yellow-800 mb-2">بسم الله الرحمن الرحيم</h1>
        <h2 className="text-4xl font-bold text-yellow-800 mb-4">شهادة تقدير</h2>
        <div className="w-48 h-1 bg-yellow-600 mx-auto mb-8"></div>
      </div>
      
      {/* محتوى الشهادة */}
      <div className="my-8">
        <p className="text-xl mb-4">تشهد إدارة حلقات المسجد بأن الطالب</p>
        <h2 className="text-4xl font-bold text-yellow-800 my-6">{student.studentName}</h2>
        <p className="text-xl">قد أظهر تميزاً واجتهاداً في حفظ كتاب الله</p>
        
        <div className="mt-8 text-lg">
          <p className="mb-2">وحصل على مجموع نقاط: <span className="font-bold text-yellow-800 text-2xl">{student.points}</span></p>
          <p>المستوى: <span className="font-bold">{student.parts}</span> - الحلقة: <span className="font-bold">{student.level}</span></p>
        </div>
      </div>
      
      {/* الختام */}
      <div className="mt-12">
        <p className="italic text-lg text-yellow-800">نسأل الله أن يبارك له في علمه وأن ينفع به الإسلام والمسلمين</p>
        <div className="w-32 h-1 bg-yellow-600 mx-auto my-4"></div>
        <p className="text-lg">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
      
      {/* التواقيع */}
      <div className="flex justify-between mt-10 px-16">
        <div className="text-center">
          <p className="mb-16">توقيع المشرف</p>
          <div className="w-32 h-0.5 bg-gray-400 mx-auto"></div>
        </div>
        <div className="text-center">
          <p className="mb-16">ختم الإدارة</p>
          <div className="w-32 h-0.5 bg-gray-400 mx-auto"></div>
        </div>
      </div>
      
      {/* الزخارف */}
      <div className="absolute bottom-5 right-5 opacity-10">
        <img src="/mosque-logo.png" alt="زخرفة" className="h-32" />
      </div>
    </div>
  );
  
  // التصميم العصري
  const renderModernDesign = () => (
    <div className={`certificate-content w-full max-w-4xl border-4 border-blue-600 p-8 bg-white text-center relative ${textColorClass}`}>
      <div className="absolute inset-0 bg-blue-500 m-4 opacity-5 rounded-lg"></div>
      
      <div className="absolute top-0 left-0 w-full h-16 bg-blue-600"></div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-600"></div>
      
      <div className="flex justify-between mt-20">
        <img src="/mosque-logo.png" alt="شعار المسجد" className="h-16" />
        <img src="/nafes-logo.png" alt="شعار نافس" className="h-16" />
      </div>
      
      <div className="mt-8">
        <h1 className="text-2xl text-blue-800 mb-2">بسم الله الرحمن الرحيم</h1>
        <h2 className="text-5xl font-bold text-blue-700 mb-6 bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">شهادة تقدير</h2>
      </div>
      
      <div className="my-10 px-12">
        <p className="text-xl text-gray-700 mb-6">تشهد إدارة حلقات المسجد بأن الطالب</p>
        <h2 className="text-5xl font-bold text-blue-900 border-b-2 border-t-2 border-blue-200 py-6 my-6">{student.studentName}</h2>
        <p className="text-xl text-gray-700 mb-8">قد أظهر تميزاً واجتهاداً في حفظ كتاب الله</p>
        
        <div className="flex justify-center gap-12 my-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
              <span className="text-3xl font-bold text-blue-800">{student.points}</span>
            </div>
            <p className="mt-2 text-gray-600">النقاط</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
              <span className="text-lg font-bold text-blue-800">{student.parts}</span>
            </div>
            <p className="mt-2 text-gray-600">المستوى</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
              <span className="text-lg font-bold text-blue-800">{student.level}</span>
            </div>
            <p className="mt-2 text-gray-600">الحلقة</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <p className="italic text-md text-blue-800">نسأل الله أن يبارك له في علمه وأن ينفع به الإسلام والمسلمين</p>
        <p className="text-sm mt-4 text-gray-600">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
      
      <div className="flex justify-around mt-12 px-16">
        <div className="text-center">
          <div className="w-32 h-0.5 bg-blue-400 mx-auto mb-2"></div>
          <p className="text-blue-800">توقيع المشرف</p>
        </div>
        <div className="text-center">
          <div className="w-32 h-0.5 bg-blue-400 mx-auto mb-2"></div>
          <p className="text-blue-800">ختم الإدارة</p>
        </div>
      </div>
    </div>
  );
  
  // التصميم المميز للمتفوقين
  const renderPremiumDesign = () => (
    <div className={`certificate-content w-full max-w-4xl border-8 border-yellow-800 p-10 bg-gradient-to-r from-yellow-50 to-yellow-100 text-center relative ${textColorClass}`}>
      <div className="absolute inset-0 bg-[url('/mosque-logo.png')] bg-no-repeat bg-center opacity-5"></div>
      
      {/* زخارف ذهبية */}
      <div className="absolute top-2 right-2 left-2 h-16 border-4 border-yellow-700 rounded-lg"></div>
      <div className="absolute bottom-2 right-2 left-2 h-16 border-4 border-yellow-700 rounded-lg"></div>
      
      <div className="absolute top-6 right-6">
        <img src="/mosque-logo.png" alt="شعار المسجد" className="h-24 filter drop-shadow-lg" />
      </div>
      
      <div className="absolute top-6 left-6">
        <img src="/nafes-logo.png" alt="شعار نافس" className="h-24 filter drop-shadow-lg" />
      </div>
      
      <div className="mt-24">
        <h1 className="text-3xl font-bold text-yellow-900 mb-4">بسم الله الرحمن الرحيم</h1>
        <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-900">شهادة تقدير وتميز</h2>
        <div className="w-64 h-1 bg-gradient-to-r from-yellow-600 to-yellow-900 mx-auto mb-8"></div>
      </div>
      
      <div className="my-10 px-12">
        <p className="text-2xl text-yellow-800 mb-6">تشهد إدارة حلقات المسجد  بأن المتميز</p>
        <h2 className="text-5xl font-bold text-yellow-900 my-8 px-8 py-4 border-double border-4 border-yellow-600 rounded-lg shadow-inner bg-yellow-50">{student.studentName}</h2>
        <p className="text-2xl text-yellow-800 mb-4">قد حقق تميزاً وإنجازاً متفوقاً في حفظ كتاب الله</p>
        
        <div className="flex justify-center my-8">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-12 py-6 rounded-full shadow-xl">
            <span className="text-4xl font-bold">{student.points}</span>
            <span className="text-xl font-bold"> نقطة</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-yellow-50 rounded-lg shadow border border-yellow-200">
            <p className="text-yellow-800 text-xl">المستوى</p>
            <p className="font-bold text-yellow-900 text-2xl">{student.parts}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg shadow border border-yellow-200">
            <p className="text-yellow-800 text-xl">الحلقة</p>
            <p className="font-bold text-yellow-900 text-2xl">{student.level}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10 mb-20">
        <p className="text-xl italic text-yellow-800">نسأل الله أن يبارك له في علمه وأن ينفع به الإسلام والمسلمين</p>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-700 to-transparent mx-auto my-4"></div>
        <p className="text-md text-yellow-800">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
      
      <div className="flex justify-around mt-8 px-16">
        <div className="text-center">
          <p className="mb-12 text-lg text-yellow-800">توقيع المشرف</p>
          <div className="w-40 h-0.5 bg-yellow-600 mx-auto"></div>
        </div>
        <div className="text-center">
          <p className="mb-12 text-lg text-yellow-800">ختم الإدارة</p>
          <div className="w-40 h-0.5 bg-yellow-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
  
  // التصميم البسيط
  const renderSimpleDesign = () => (
    <div className={`certificate-content w-full max-w-4xl border-2 border-gray-300 p-10 bg-gray-50 text-center relative ${textColorClass}`}>
      <div className="flex justify-between mb-6">
        <img src="/mosque-logo.png" alt="شعار المسجد" className="h-16 grayscale" />
        <img src="/nafes-logo.png" alt="شعار نافس" className="h-16 grayscale" />
      </div>
      
      <div className="border-t border-b border-gray-300 py-6 my-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-1">شهادة تقدير</h1>
      </div>
      
      <div className="my-12">
        <p className="text-xl text-gray-600 mb-8">تشهد إدارة حلقات المسجد بأن الطالب</p>
        <h2 className="text-4xl font-bold text-gray-800 my-8">{student.studentName}</h2>
        <p className="text-xl text-gray-600 mb-4">قد أظهر تميزاً واجتهاداً في حفظ كتاب الله</p>
        
        <div className="mt-10 mb-12">
          <p className="text-lg text-gray-600">النقاط: <span className="font-bold text-gray-800">{student.points}</span></p>
          <p className="text-lg text-gray-600">المستوى: <span className="font-bold text-gray-800">{student.parts}</span> - الحلقة: <span className="font-bold text-gray-800">{student.level}</span></p>
        </div>
      </div>
      
      <div className="mt-16">
        <p className="text-md italic text-gray-600">نسأل الله أن يبارك له في علمه وأن ينفع به الإسلام والمسلمين</p>
        <p className="text-sm mt-6 text-gray-500">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mt-16">
        <div className="text-center">
          <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2"></div>
          <p className="text-gray-600">توقيع المشرف</p>
        </div>
        <div className="text-center">
          <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2"></div>
          <p className="text-gray-600">ختم الإدارة</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`certificate-container flex justify-center items-center p-4 print:bg-white print:text-black`}>
      {renderCertificateByDesign()}
    </div>
  );
}
