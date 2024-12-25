import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HomePage } from './pages/HomePage';
import { StudentsPage } from './pages/StudentsPage';
import { RecordsPage } from './pages/RecordsPage';
import { TeachersPage } from './pages/TeachersPage';
import { useThemeStore } from './store/themeStore';

export default function App() {
  const { isDark } = useThemeStore();
  
  return (
    <Router>
      <div className={`min-h-screen ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-brown-50 to-brown-100'
      }`}>
        <main className="container mx-auto p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'rtl',
            style: {
              background: isDark ? '#1f2937' : '#333',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}