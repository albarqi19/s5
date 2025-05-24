import React from 'react';
import { motion } from 'framer-motion';
import { Award } from '../../components/icons';
import type { Student } from '../../types/student';

interface TopStudentsDisplayProps {
  students: Student[];
}

export function TopStudentsDisplay({ students }: TopStudentsDisplayProps) {
  // الرسومات المتحركة للعناصر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  // حساب طول العناصر التي ستعرض (الحد الأقصى 3)
  const displayStudents = students.slice(0, 3);

  const medalColors = [
    'bg-yellow-500', // ذهبي للمرتبة الأولى
    'bg-gray-400',   // فضي للمرتبة الثانية
    'bg-amber-700',  // برونزي للمرتبة الثالثة
  ];

  const medalSizeClasses = [
    'w-52 h-52', // حجم ميدالية المركز الاول
    'w-44 h-44', // حجم ميدالية المركز الثاني
    'w-40 h-40', // حجم ميدالية المركز الثالث
  ];

  // حساب ترتيب العرض حسب المراكز
  const displayOrder = [1, 0, 2]; // الترتيب: المركز الثاني، المركز الأول، المركز الثالث

  return (
    <motion.div 
      className="w-full max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >      <motion.h1 
        className="text-5xl font-bold text-center text-white mb-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
      >
        <span className="inline-block mr-3 animate-pulse">
          <Award size={50} className="text-yellow-400" />
        </span>
        الطلاب المتميزون
      </motion.h1>
      
      <div className="flex justify-center items-end mt-20 gap-5">
        {displayOrder.map((order, idx) => {
          const student = displayStudents[order];
          if (!student) return null;
          
          const position = order + 1;
          const isFirst = position === 1;
          
          return (
            <motion.div 
              key={student.id} 
              className="flex flex-col items-center"
              variants={itemVariants}
            >
              <div className="mb-4">
                <div className={`relative ${isFirst ? 'mb-5' : ''}`}>
                  <motion.div 
                    className={`${medalSizeClasses[order]} rounded-full flex items-center justify-center ${medalColors[order]} shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-7xl font-bold text-white">{position}</span>
                  </motion.div>
                  
                  {isFirst && (
                    <motion.div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      <img src="/logo.png" alt="Crown" className="w-16 h-16 object-contain" />
                    </motion.div>
                  )}
                </div>
              </div>              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white w-[350px] shadow-lg display-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-3xl font-bold mb-2 leading-tight student-name" style={{ minHeight: '80px', width: '100%' }}>{student.studentName}</h3>
                <p className="text-xl opacity-90 mb-2">الحلقة: {student.level}</p>
                <div className="flex justify-center">
                  <motion.div 
                    className="bg-blue-500 rounded-full px-4 py-1 text-white font-bold text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + idx * 0.2, type: "spring" }}
                  >
                    {student.points} نقطة
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
