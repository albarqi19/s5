import React from 'react';
import type { Student } from '../../types/student';

interface CertificateTemplateProps {
  student: Student;
}

export function CertificateTemplate({ student }: CertificateTemplateProps) {
  return (
    <div className="certificate-container flex justify-center items-center p-4">
      <div className="certificate-content w-full max-w-4xl border-4 border-yellow-600 p-8 bg-yellow-50 text-center relative">
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
    </div>
  );
}
