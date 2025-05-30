import React, { useState, useRef } from 'react';
import type { Student } from '../../types/student';
import { useThemeStore } from '../../store/themeStore';
import { StudentCard } from './StudentCard';
import { CertificateCard } from '../certificates/CertificateCard';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  isOpen: boolean;
}

export function StudentDetailsModal({ student, onClose, onEdit, onDelete, isOpen }: StudentDetailsModalProps) {
  const { isDark } = useThemeStore();
  const [showCard, setShowCard] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: 'white',
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `شهادة-شكر-${student.studentName}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const sendToWhatsApp = async (elementRef: React.RefObject<HTMLDivElement>, type: 'card' | 'certificate') => {
    if (!student?.phone || !elementRef.current) {
      toast.error('رقم الهاتف أو الصورة غير متوفرة');
      return;
    }

    try {
      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: 'white',
        width: type === 'card' ? 437 : elementRef.current.offsetWidth, 
        height: type === 'card' ? 425 : elementRef.current.offsetHeight 
      });

      const imageData = canvas.toDataURL('image/png');

      const response = await fetch('https://164.92.246.226:3002/send-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: student.phone,
          imageData: imageData,
          type: type 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`تم إرسال ${type === 'card' ? 'البطاقة' : 'الشهادة'} بنجاح عبر واتساب`);
      } else {
        throw new Error(data.error || 'فشل في إرسال الصورة');
      }
    } catch (error) {
      console.error('Error sending image:', error);
      toast.error('حدث خطأ أثناء إرسال الصورة: ' + error.message);
    }
  };

  const sendCardToWhatsApp = () => sendToWhatsApp(cardRef, 'card');
  const sendCertificateToWhatsApp = () => sendToWhatsApp(certificateRef, 'certificate');

  if (!isOpen) return null;

  const modalClasses = `fixed inset-0 z-50 flex items-center justify-center p-4 ${
    isDark ? 'bg-gray-900/75' : 'bg-black/75'
  }`;

  return (
    <>
      <div className={modalClasses} onClick={onClose}>
        <div
          className={`w-full max-w-2xl rounded-2xl p-6 shadow-xl transition-all ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className={`absolute left-0 top-0 p-2 rounded-full transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {!showCard && !showCertificate ? (
              <div className="bg-[#1e2530] text-white p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">تفاصيل الطالب</h2>
                </div>

                <div className="bg-[#262f3d] p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{student.studentName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        {student.points} نقطة
                      </span>
                      <span className="text-gray-400 text-sm">
                        {student.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="bg-[#262f3d] p-6 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-gray-400 mb-2">المستوى الحالي:</div>
                        <div className="text-xl font-bold">
                          {student.parts}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-2">الحلقة الحالية:</div>
                        <div className="text-xl font-bold">{student.level}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <h4 className="text-blue-400 text-sm mb-1">رقم الهاتف</h4>
                      <p className="text-lg font-bold dir-ltr text-left text-blue-500" style={{ wordBreak: 'break-all' }}>{student.phone}</p>
                    </div>

                    <div className="bg-red-500/10 p-4 rounded-lg">
                      <h4 className="text-red-400 text-sm mb-1">المخالفات</h4>
                      <p className="text-lg font-bold text-red-500">لا توجد مخالفات</p>
                    </div>

                    <div className="bg-green-500/10 p-4 rounded-lg">
                      <h4 className="text-green-400 text-sm mb-1">النقاط</h4>
                      <p className="text-2xl font-bold text-green-500">{student.points}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCard(true)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    طباعة البطاقة
                  </button>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    شهادة شكر
                  </button>
                  <button
                    onClick={() => onEdit(student)}
                    className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDelete(student)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ) : showCard ? (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowCard(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    رجوع
                  </button>
                </div>
                <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  <div ref={cardRef}>
                    <StudentCard student={student} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowCard(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={sendCardToWhatsApp}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    إرسال للواتساب
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-end mb-4 gap-2">
                  <button
                    onClick={() => setShowCertificate(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDownloading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {isDownloading ? 'جاري التنزيل...' : 'تنزيل الشهادة'}
                  </button>
                  <button
                    onClick={sendCertificateToWhatsApp}
                    disabled={isDownloading}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDownloading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isDownloading ? 'جاري الإرسال...' : 'إرسال للواتساب'}
                  </button>
                </div>
                <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  <CertificateCard ref={certificateRef} student={student} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}