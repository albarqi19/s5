import React from 'react';
import type { Student } from '../../types/student';

interface CertificateTemplateProps {
  student: Student;
}

export function CertificateTemplate({ student }: CertificateTemplateProps) {
  // تنسيق التاريخ الهجري
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const hijriDate = formatter.format(today);

  return (
    <div style={{
      width: '297mm',
      height: '210mm',
      backgroundColor: 'white',
      position: 'relative',
      padding: '20mm',
      direction: 'rtl',
      boxSizing: 'border-box',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* الإطار الخارجي */}
      <div style={{
        border: '8px double #C17F0E',
        width: '100%',
        height: '100%',
        padding: '15mm',
        position: 'relative',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* الشعارات */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15mm',
        }}>
          <div style={{
            width: '25mm',
            height: '25mm',
            border: '2px solid #C17F0E',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#C17F0E',
            textAlign: 'center',
            padding: '5px',
          }}>
            جامع<br />الشيخ سعيد رداد
          </div>
          <div style={{
            width: '25mm',
            height: '25mm',
            border: '2px solid #C17F0E',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#C17F0E',
            textAlign: 'center',
            padding: '5px',
          }}>
            برنامج<br />نافس
          </div>
        </div>

        {/* عنوان الشهادة */}
        <div style={{
          textAlign: 'center',
          marginBottom: '15mm',
          width: '100%',
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#C17F0E',
            marginBottom: '10px',
            fontFamily: 'Arial',
          }}>شهادة شكر وتقدير</h1>
          <div style={{
            width: '64mm',
            height: '1mm',
            backgroundColor: '#C17F0E',
            margin: '0 auto',
          }}></div>
        </div>

        {/* نص الشهادة */}
        <div style={{
          textAlign: 'center',
          marginBottom: '15mm',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <p style={{
            fontSize: '24px',
            marginBottom: '10mm',
            fontFamily: 'Arial',
          }}>تشهد إدارة حلقات جامع الشيخ سعيد رداد بأن الطالب</p>
          <h2 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#C17F0E',
            marginBottom: '10mm',
            fontFamily: 'Arial',
          }}>{student.studentName}</h2>
          <p style={{
            fontSize: '24px',
            lineHeight: '1.8',
            fontFamily: 'Arial',
          }}>
            قد تميز في حلقات تحفيظ القرآن الكريم في {student.level}<br />
            وحصل على {student.points} نقطة<br />
            نسأل الله أن يبارك في جهوده وأن يجعله من أهل القرآن
          </p>
        </div>

        {/* التوقيع */}
        <div style={{
          position: 'absolute',
          bottom: '15mm',
          left: '15mm',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10mm',
            fontFamily: 'Arial',
          }}>إدارة الحلقات</p>
          <div style={{
            width: '48mm',
            height: '0.5mm',
            backgroundColor: '#C17F0E',
          }}></div>
        </div>

        {/* التاريخ */}
        <div style={{
          position: 'absolute',
          bottom: '15mm',
          right: '15mm',
          textAlign: 'right',
        }}>
          <p style={{
            fontSize: '20px',
            fontFamily: 'Arial',
          }}>التاريخ: {hijriDate}</p>
        </div>

        {/* الزخارف */}
        <div style={{
          position: 'absolute',
          top: '4mm',
          left: '4mm',
          width: '16mm',
          height: '16mm',
          borderTop: '1mm solid #C17F0E',
          borderLeft: '1mm solid #C17F0E',
        }}></div>
        <div style={{
          position: 'absolute',
          top: '4mm',
          right: '4mm',
          width: '16mm',
          height: '16mm',
          borderTop: '1mm solid #C17F0E',
          borderRight: '1mm solid #C17F0E',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '4mm',
          left: '4mm',
          width: '16mm',
          height: '16mm',
          borderBottom: '1mm solid #C17F0E',
          borderLeft: '1mm solid #C17F0E',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '4mm',
          right: '4mm',
          width: '16mm',
          height: '16mm',
          borderBottom: '1mm solid #C17F0E',
          borderRight: '1mm solid #C17F0E',
        }}></div>
      </div>
    </div>
  );
}
