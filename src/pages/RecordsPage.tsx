import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { useRecordsColumns } from '../hooks/useRecordsColumns';
import { useApi } from '../hooks/api/useApi';
import { Record } from '../types/record';
import { RecordDetailsModal } from '../components/RecordDetailsModal';
import { PageLayout } from '../components/layout/PageLayout';
import { useThemeStore } from '../store/themeStore';
import { Filter, Plus } from '../components/icons';
import { AddRecordModal } from '../components/records/AddRecordModal';

export function RecordsPage() {
  const { isDark } = useThemeStore();
  const [showAll, setShowAll] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { 
    data: records = [], 
    isLoading, 
    error,
    refetch
  } = useApi<Record>('records');
  
  // إضافة تسجيلات تشخيصية للبيانات المستلمة
  useEffect(() => {
    if (records && records.length > 0) {
      console.log('Records received in frontend:', records.length);
      console.log('First record example:', records[0]);
      console.log('Pages value in first record:', records[0]?.pages);
      
      // التحقق من السجلات ذات قيمة pages فارغة
      const emptyPagesRecords = records.filter(record => !record.pages);
      console.log('Records with empty pages:', emptyPagesRecords.length);
    }
  }, [records]);

  const { columns, getRowProps } = useRecordsColumns({
    onRecordClick: (record) => setSelectedRecord(record)
  });

  // استخراج قائمة المعلمين الفريدة من السجلات
  const uniqueTeachers = useMemo(() => {
    if (!records?.length) return [];
    const teachers = Array.from(new Set(records.map(record => record.teacherName)));
    return teachers.filter(Boolean).sort();
  }, [records]);

  // استخراج قائمة الطلاب الفريدة من السجلات
  const uniqueStudents = useMemo(() => {
    if (!records?.length) return [];
    const students = Array.from(new Set(records.map(record => record.studentName)));
    return students.filter(Boolean).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (!records) return [];
    
    let filtered = [...records];
    
    // تطبيق فلتر التاريخ
    const now = new Date();
    if (filterDate === 'today') {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === now.toDateString();
      });
    } else if (filterDate === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => new Date(record.date) >= weekAgo);
    } else if (filterDate === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => new Date(record.date) >= monthAgo);
    }

    // تطبيق فلتر المعلم
    if (teacherFilter) {
      filtered = filtered.filter(record => record.teacherName === teacherFilter);
    }

    // تطبيق فلتر الطالب
    if (studentFilter) {
      filtered = filtered.filter(record => record.studentName === studentFilter);
    }

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return showAll ? filtered : filtered.slice(0, 20);
  }, [records, filterDate, showAll, teacherFilter, studentFilter]);

  const handleAddSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-red-500 text-center py-8">
          حدث خطأ أثناء تحميل البيانات
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            سجل النقاط
          </h1>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700`}
            >
              <Plus size={18} />
              إضافة سجل جديد
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter size={18} />
              {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر المتقدمة'}
            </button>
          </div>
        </div>

        {/* أدوات التصفية */}
        <div className={`p-6 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterDate('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterDate === 'all'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterDate('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterDate === 'today'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              اليوم
            </button>
            <button
              onClick={() => setFilterDate('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterDate === 'week'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              آخر أسبوع
            </button>
            <button
              onClick={() => setFilterDate('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterDate === 'month'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              آخر شهر
            </button>
          </div>

          {/* فلاتر متقدمة */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  تصفية حسب المعلم
                </label>
                <select
                  value={teacherFilter}
                  onChange={(e) => setTeacherFilter(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">جميع المعلمين</option>
                  {uniqueTeachers.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  تصفية حسب الطالب
                </label>
                <select
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">جميع الطلاب</option>
                  {uniqueStudents.map(student => (
                    <option key={student} value={student}>{student}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className={`rounded-xl shadow-lg overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          {filteredRecords.length > 0 ? (
            <>
              <DataTable 
                data={filteredRecords} 
                columns={columns}
                getRowProps={getRowProps}
              />
              
              {!showAll && records.length > 20 && (
                <div className={`p-4 text-center border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <button
                    onClick={() => setShowAll(true)}
                    className={`text-sm font-medium ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    عرض المزيد من السجلات
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={`p-8 text-center ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              لا توجد سجلات متاحة
            </div>
          )}
        </div>
      </div>

      {selectedRecord && (
        <RecordDetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      <AddRecordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </PageLayout>
  );
}