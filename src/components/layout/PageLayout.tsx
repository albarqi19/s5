import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useThemeStore } from '../../store/themeStore';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const marqueeText = "جامع الشيخ سعيد رداد - رحمه الله- / مجمع سعيد رداد القرآني / برنامج نافس لمتابعة وتحفيز طلاب الحلقات";

export function PageLayout({ children, showBackButton = true }: PageLayoutProps) {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';

  return (
    <div dir="rtl" className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10">
        {/* Navigation Bar */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {showBackButton && (
                  <button
                    onClick={() => navigate(-1)}
                    className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-black transition-all duration-300 ${
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Marquee Banner */}
        <div className={`relative ${isDark ? 'bg-blue-900' : 'bg-blue-600'} text-white py-3 transition-colors duration-300`}>
          <div className="marquee-container overflow-hidden whitespace-nowrap">
            <div className="animate-marquee">
              {marqueeText}
              <span className="mx-8">|</span>
              {marqueeText}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-8 transition-all duration-300">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800' : 'bg-white'} py-6 transition-colors duration-300`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            جميع الحقوق محفوظة © {new Date().getFullYear()} - برنامج نافس
          </p>
        </div>
      </footer>
    </div>
  );
}