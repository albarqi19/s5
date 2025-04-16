import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StudentsPage } from './pages/StudentsPage';
import { RecordsPage } from './pages/RecordsPage';
import { TeachersPage } from './pages/TeachersPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { useThemeStore } from './store/themeStore';
import { GlobalToast } from './components/common/GlobalToast';

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
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <GlobalToast />
      </div>
    </Router>
  );
}