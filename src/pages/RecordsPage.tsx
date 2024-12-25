import React, { useState, useMemo } from 'react';
import { DataTable } from '../components/DataTable';
import { useRecordsColumns } from '../hooks/useRecordsColumns';
import { useApi } from '../hooks/api/useApi';
import { Record } from '../types/record';
import { RecordDetailsModal } from '../components/RecordDetailsModal';
import { PageLayout } from '../components/layout/PageLayout';
import { useThemeStore } from '../store/themeStore';

export function RecordsPage() {
  const { isDark } = useThemeStore();
  const [showAll, setShowAll] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const { 
    data: records = [], 
    isLoading, 
    error 
  } = useApi<Record>('records');

  const { columns, getRowProps } = useRecordsColumns({
    onRecordClick: (record) => setSelectedRecord(record)
  });

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

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return showAll ? filtered : filtered.slice(0, 20);
  }, [records, filterDate, showAll]);

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
    </PageLayout>
  );
}