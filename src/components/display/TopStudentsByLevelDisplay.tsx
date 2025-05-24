import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from '../../components/icons';
import type { Student } from '../../types/student';

interface TopStudentsByLevelDisplayProps {
  students: Student[];
}

export function TopStudentsByLevelDisplay({ students }: TopStudentsByLevelDisplayProps) {
  // تنظيم الطلاب حسب الحلقات
  const studentsByLevel = useMemo(() => {
    const levels: {[key: string]: Student[]} = {};
    
    // تجميع الطلاب حسب الحلقة
    students.forEach(student => {
      if (!student.level) return;
      
      if (!levels[student.level]) {
        levels[student.level] = [];
      }
      levels[student.level].push(student);
    });
    
    // ترتيب الطلاب داخل كل حلقة حسب النقاط
    Object.keys(levels).forEach(level => {
      levels[level].sort((a, b) => (b.points || 0) - (a.points || 0));
    });
    
    return levels;
  }, [students]);

  // استخراج قائمة بأسماء الحلقات
  const levelNames = useMemo(() => {
    return Object.keys(studentsByLevel);
  }, [studentsByLevel]);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // تبديل الحلقة كل 10 ثواني
  useEffect(() => {
    if (levelNames.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentLevelIndex(prev => (prev + 1) % levelNames.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [levelNames.length]);

  const currentLevel = levelNames[currentLevelIndex];
  const currentStudents = currentLevel ? studentsByLevel[currentLevel].slice(0, 5) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 12
      }
    }
  };

  return (
    <div className="w-full max-w-6xl px-8">
      <motion.h1 
        className="text-4xl font-bold text-center text-white mb-4 flex items-center justify-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GraduationCap size={40} className="ml-3" />
        <span>أفضل الطلاب في</span>
      </motion.h1>

      <motion.div
        className="text-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 8, delay: 0.3 }}
      >
        <h2 className="text-5xl font-bold text-yellow-300 mb-2 inline-block bg-blue-900/50 px-8 py-2 rounded-full">
          حلقة {currentLevel}
        </h2>
      </motion.div>
      
      <AnimatePresence mode="wait">        <motion.div
          key={currentLevel}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ width: '800px' }}
        >
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div className="text-white text-center font-bold text-xl">المركز</div>
            <div className="text-white text-center font-bold text-xl">الاسم</div>
            <div className="text-white text-center font-bold text-xl">النقاط</div>
          </div>
          
          <div className="mt-4 space-y-3">
            {currentStudents.map((student, index) => (
              <motion.div
                key={student.id}
                variants={itemVariants}
                className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 rounded-xl ${
                  index % 2 === 0 ? 'bg-blue-900/30' : 'bg-purple-900/30'
                } transition-all hover:bg-blue-700/40`}
              >
                <div className="flex justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                    ${index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-700' : 'bg-blue-800'} 
                    text-white`}
                  >
                    {index + 1}
                  </div>
                </div>
                
                <div className="text-white text-xl text-right font-bold truncate">
                  {student.studentName}
                </div>
                
                <motion.div 
                  className="bg-green-500 rounded-full px-4 py-1 text-white font-bold text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {student.points}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <motion.div 
        className="mt-6 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {levelNames.map((level, index) => (
          <div 
            key={level}
            className={`w-3 h-3 rounded-full ${
              index === currentLevelIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
