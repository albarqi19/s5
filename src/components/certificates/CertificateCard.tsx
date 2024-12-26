import React, { forwardRef } from 'react';
import type { Student } from '../../types/student';

interface CertificateCardProps {
  student: Student;
}

export const CertificateCard = forwardRef<HTMLDivElement, CertificateCardProps>(
  ({ student }, ref) => {
    const currentDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div ref={ref} className="w-[800px] h-[600px] bg-white relative overflow-hidden">
        {/* خلفية مزخرفة */}
        <div className="absolute inset-0 bg-[url('/certificate-bg.png')] opacity-10" />
        
        {/* حدود الشهادة */}
        <div className="absolute inset-4 border-8 border-double border-amber-600/20 rounded-lg" />
        <div className="absolute inset-6 border-2 border-amber-600/20 rounded-lg" />

        {/* المحتوى */}
        <div className="relative h-full p-8 flex flex-col">
          {/* العنوان */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-amber-700">شهادة شكر وتقدير</h1>
          </div>

          {/* نص الشهادة */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xl text-gray-800 leading-relaxed text-center">
                يسرنا أن نقدم شهادة الشكر والتقدير للطالب المتميز
              </p>
              
              <h2 className="text-2xl font-bold text-amber-800 text-center py-2">
                {student.studentName}
              </h2>

              {/* تفاصيل الطالب */}
              <div className="grid grid-cols-2 gap-3 mx-auto max-w-xl text-right bg-amber-50/50 rounded-lg p-4 my-2">
                <div className="border-r-2 border-amber-200 pr-3">
                  <span className="text-gray-600 text-sm">الحلقة:</span>
                  <span className="text-amber-800 font-bold mr-2 text-sm">{student.level}</span>
                </div>
                <div className="pr-3">
                  <span className="text-gray-600 text-sm">المستوى الحالي:</span>
                  <span className="text-amber-800 font-bold mr-2 text-sm">{student.parts}</span>
                </div>
                <div className="border-r-2 border-amber-200 pr-3">
                  <span className="text-gray-600 text-sm">عدد النقاط:</span>
                  <span className="text-amber-800 font-bold mr-2 text-sm">{student.points} نقطة</span>
                </div>
                <div className="pr-3">
                  <span className="text-gray-600 text-sm">حالة المخالفات:</span>
                  <span className="text-green-600 font-bold mr-2 text-sm">لا توجد مخالفات</span>
                </div>
              </div>

              <p className="text-base text-gray-800 leading-relaxed text-center px-8">
                وذلك لتميزه في حفظ وتلاوة كتاب الله، وإتمامه للمقرر بكل إتقان وإخلاص.
                حيث أظهر التزاماً ملحوظاً في الحضور والمشاركة، وتفوقاً في الأداء والحفظ.
              </p>

              <p className="text-sm text-gray-700 text-center px-8">
                نسأل الله أن يبارك له في حفظه، وأن يجعل القرآن ربيع قلبه ونور صدره،
                وأن يرفع درجاته في الدنيا والآخرة.
              </p>
            </div>

            {/* التوقيع والتاريخ */}
            <div className="flex flex-col items-center mt-4">
              <p className="text-base font-bold text-gray-800 mb-2">{currentDate} :تحريراً في</p>
              <p className="text-sm font-bold text-gray-800 mb-2">إدارة حلقات المسجد</p>
              <img src="/mosque-logo.png" alt="شعار المسجد" className="h-16 object-contain" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
