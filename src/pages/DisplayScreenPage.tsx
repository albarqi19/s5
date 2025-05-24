import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/api/useApi';
import { PageLayout } from '../components/layout/PageLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TopStudentsDisplay } from '../components/display/TopStudentsDisplay';
import { TopStudentsByLevelDisplay } from '../components/display/TopStudentsByLevelDisplay';
import { Monitor, Maximize2, Minimize2 } from '../components/icons';
import type { Student } from '../types/student';

export function DisplayScreenPage() {
  const { data: studentsData = [], loading, error } = useApi<Student[]>('students');
  const [displayMode, setDisplayMode] = useState<'top3' | 'topByLevel'>('top3');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDisplayMode, setIsDisplayMode] = useState(false);

  // تبديل وضع العرض كل ٢٠ ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDisplayMode) {
        setDisplayMode(prevMode => prevMode === 'top3' ? 'topByLevel' : 'top3');
      }
    }, 20000); // 20 seconds
    
    return () => clearInterval(timer);
  }, [isDisplayMode]);

  // معالجة وضع ملء الشاشة
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`خطأ في تفعيل وضع ملء الشاشة: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          console.error(`خطأ في الخروج من وضع ملء الشاشة: ${err.message}`);
        });
      }
    }
  };

  // بدء وضع العرض
  const startDisplayMode = () => {
    setIsDisplayMode(true);
    if (!isFullscreen) {
      toggleFullscreen();
    }
  };

  // الخروج من وضع العرض
  const exitDisplayMode = () => {
    setIsDisplayMode(false);
    if (isFullscreen) {
      toggleFullscreen();
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center text-red-500 p-4">
          <p>حدث خطأ في تحميل البيانات</p>
        </div>
      </PageLayout>
    );
  }

  // فرز الطلاب حسب النقاط تنازلياً
  const sortedStudents = [...studentsData].sort((a, b) => (b.points || 0) - (a.points || 0));
    // إذا كنا في وضع العرض - يظهر شاشة العرض بملء الشاشة
  if (isDisplayMode) {
    return (      <div className="fullscreen-display">
        <div className="content-wrapper bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="absolute top-0 right-0 left-0 p-4 flex justify-center">
            {/* استخدام فلتر لتحويل الشعار إلى اللون الأبيض */}
            <img 
              src="/mosque-logo.png" 
              alt="شعار" 
              className="h-24 object-contain" 
              style={{ filter: 'brightness(0) invert(1)' }} 
            />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 text-center p-4 text-white text-xl">
            <h2 className="font-bold text-2xl">برنامج نافس للتميز</h2>
          </div>
          
          <button 
            onClick={exitDisplayMode}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <Minimize2 size={24} />
          </button>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {displayMode === 'top3' ? (
              <TopStudentsDisplay students={sortedStudents.slice(0, 3)} />
            ) : (
              <TopStudentsByLevelDisplay students={studentsData} />
            )}
          </div>

          {/* زخرفة خلفية */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // وضع لوحة التحكم بشاشة العرض - قبل الانتقال إلى وضع العرض
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">لوحة التحكم بشاشة العرض</h1>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              <span>{isFullscreen ? 'الخروج من وضع ملء الشاشة' : 'تفعيل وضع ملء الشاشة'}</span>
            </button>
          </div>          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8">
            <p className="text-blue-800 dark:text-blue-300">
              هذه الصفحة تتيح لك عرض الطلاب المتميزين على شاشة عرض بحجم 1920×1080 بكسل. سيتم عرض الطلاب الثلاثة الأوائل ثم أفضل 5 طلاب في كل حلقة بتناوب.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border dark:border-gray-700 rounded-xl p-6 shadow-sm bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Monitor size={20} />
                <span>معاينة العرض</span>
              </h3>              <div className="aspect-[16/9] bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center transform scale-[0.2]">
                  {displayMode === 'top3' ? (
                    <TopStudentsDisplay students={sortedStudents.slice(0, 3)} />
                  ) : (
                    <TopStudentsByLevelDisplay students={studentsData} />
                  )}
                </div>
              </div>
            </div>

            <div className="border dark:border-gray-700 rounded-xl p-6 shadow-sm bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4">إعدادات العرض</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضع العرض الحالي</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDisplayMode('top3')}
                    className={`px-4 py-2 rounded-lg flex-1 ${
                      displayMode === 'top3' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    الطلاب الثلاثة الأوائل
                  </button>
                  <button
                    onClick={() => setDisplayMode('topByLevel')}
                    className={`px-4 py-2 rounded-lg flex-1 ${
                      displayMode === 'topByLevel' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    أفضل طلاب الحلقات
                  </button>
                </div>
              </div>
              
              <div className="mt-10">
                <button
                  onClick={startDisplayMode}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Monitor size={20} />
                  <span>بدء العرض على الشاشة الكاملة</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">ملاحظات:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>سيتم تبديل طريقة العرض تلقائيًا كل 20 ثانية.</li>
              <li>للحصول على أفضل تجربة، قم بتوصيل الشاشة بدقة 1080×1920 بكسل.</li>
              <li>يمكنك الضغط على زر ESC للخروج من وضع ملء الشاشة.</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
