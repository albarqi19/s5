import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AddStudentModal } from '../components/students/AddStudentModal';
import { EditStudentModal } from '../components/students/EditStudentModal';
import { StudentDetailsModal } from '../components/students/StudentDetailsModal';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
import { useThemeStore } from '../store/themeStore';
import axios from 'axios';
import { SERVER_CONFIG } from '../config/server';
import { Toast } from '../components/common/Toast';

interface Student {
  id: string;
  studentName: string;
  level: string;
  violations: number;
  parts: string;
  points: number;
  phone: string;
}

export function StudentsPage() {
  const { isDark } = useThemeStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [partsFilter, setPartsFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // الحلقات المتاحة
  const circles = [
    'حلقة الإبتدائية',
    'حلقة المتوسطة والثانوية',
    'حلقة الكبار',
    'حلقة التلقين'
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_CONFIG.baseUrl}/api/students`);
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('فشل في تحميل البيانات');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = async () => {
    await fetchStudents();
    setShowAddModal(false);
  };

  const handleEditSuccess = async () => {
    await fetchStudents();
    setStudentToEdit(null);
  };

  const handleDelete = async (student: Student) => {
    setSelectedStudent(null); // إغلاق مربع التفاصيل
    setStudentToDelete(student);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      await axios.delete(`${SERVER_CONFIG.baseUrl}/api/students/${studentToDelete.id}`);
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      setToast({ message: `تم حذف الطالب ${studentToDelete.studentName} بنجاح`, type: 'success' });
    } catch (err) {
      setToast({ message: 'حدث خطأ أثناء حذف الطالب', type: 'error' });
    }
    setStudentToDelete(null);
  };

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const response = await axios.post(`${SERVER_CONFIG.baseUrl}/api/students`, studentData);
      await fetchStudents();
      setShowAddModal(false);
      setToast({ message: `تم إضافة الطالب ${studentData.studentName} بنجاح`, type: 'success' });
    } catch (err) {
      setToast({ message: 'حدث خطأ أثناء إضافة الطالب', type: 'error' });
    }
  };

  const handleEditStudent = async (studentData: Student) => {
    try {
      await axios.put(`${SERVER_CONFIG.baseUrl}/api/students/${studentData.id}`, studentData);
      await fetchStudents();
      setStudentToEdit(null);
      setSelectedStudent(null);
      setToast({ message: `تم تحديث بيانات الطالب ${studentData.studentName} بنجاح`, type: 'success' });
    } catch (err) {
      setToast({ message: 'حدث خطأ أثناء تحديث بيانات الطالب', type: 'error' });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <PageLayout>
      <div className="min-h-screen p-6 transition-all duration-300">
        {/* Header Section with Statistics and Filters */}
        <div className={`mb-8 rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                إدارة الطلاب
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                إجمالي الطلاب: {students.length}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              إضافة طالب جديد
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>إجمالي الطلاب</span>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {students.length}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
              <span className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>متوسط النقاط</span>
              <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {Math.round(students.reduce((acc, student) => acc + student.points, 0) / students.length || 0)}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <span className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>عدد الحلقات</span>
              <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {new Set(students.map(s => s.level)).size}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <span className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>عدد المستويات</span>
              <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {new Set(students.map(s => s.parts)).size}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input with Icon */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <svg
                  className={`absolute right-3 top-2.5 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Filters */}
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">جميع الحلقات</option>
                {circles.map(circle => (
                  <option key={circle} value={circle}>{circle}</option>
                ))}
              </select>

              <select
                value={partsFilter}
                onChange={(e) => setPartsFilter(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">جميع المستويات</option>
                {[...new Set(students.map(s => s.parts))].sort().map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="desc">النقاط: من الأعلى للأدنى</option>
                <option value="asc">النقاط: من الأدنى للأعلى</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4 text-red-600 bg-red-100 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students
              .filter(student => 
                student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .filter(student => !levelFilter || student.level === levelFilter)
              .filter(student => !partsFilter || student.parts === partsFilter)
              .sort((a, b) => sortOrder === 'desc' ? b.points - a.points : a.points - b.points)
              .map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{student.studentName}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {student.level}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        student.points >= 80 ? 'bg-green-100 text-green-800' :
                        student.points >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.points} نقطة
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>المستوى</span>
                      <p className="font-medium mt-1">{student.parts}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>المخالفات</span>
                      <p className={`font-medium mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{student.violations}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddStudentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddStudent}
          />
        )}
        {studentToEdit && (
          <EditStudentModal
            isOpen={!!studentToEdit}
            student={studentToEdit}
            onClose={() => setStudentToEdit(null)}
            onSuccess={handleEditStudent}
          />
        )}
        {selectedStudent && (
          <StudentDetailsModal
            isOpen={!!selectedStudent}
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onEdit={() => {
              setStudentToEdit(selectedStudent);
              setSelectedStudent(null);
            }}
            onDelete={() => handleDelete(selectedStudent)}
          />
        )}
        <DeleteConfirmationModal
          isOpen={!!studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onConfirm={confirmDelete}
          itemName={studentToDelete ? `الطالب ${studentToDelete.studentName}` : ''}
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </PageLayout>
  );
}