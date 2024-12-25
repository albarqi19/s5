import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, ClipboardList, GraduationCap, BookOpen } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-72 bg-white shadow-lg border-l border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">برنامج نافس</h1>
            <p className="text-sm text-gray-500">لوحة التحكم</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2 flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">الرئيسية</span>
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">بيانات الطلاب</span>
        </NavLink>
        
        <NavLink
          to="/records"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <ClipboardList className="w-5 h-5" />
          <span className="font-medium">سجل النقاط</span>
        </NavLink>
        
        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium">المعلمين</span>
        </NavLink>
      </nav>
    </aside>
  );
}