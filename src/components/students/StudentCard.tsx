import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import * as htmlToImage from 'html-to-image';

interface StudentCardProps {
  student: {
    id: string;
    studentName: string;
    level: string;
  };
}

export function StudentCard({ student }: StudentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current, {
          quality: 1.0,
          backgroundColor: 'white',
        });
        
        const link = document.createElement('a');
        link.download = `بطاقة_${student.studentName}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating card:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        ref={cardRef}
        className="w-[350px] h-[500px] bg-white rounded-lg shadow-lg relative overflow-hidden"
        style={{
          fontFamily: 'Arial, sans-serif',
          direction: 'rtl'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>

        {/* Card Content */}
        <div className="relative p-6 flex flex-col items-center h-full">
          {/* Rectangular Border */}
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-gray-200 rounded-2xl m-4"></div>

          {/* Logo */}
          <div className="w-48 h-48 mb-4 relative">
            <img 
              src="/logo.png" 
              alt="نافس" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Content Container - Using flex-1 to distribute space */}
          <div className="flex flex-col items-center flex-1 justify-evenly w-full relative">
            {/* Student Name */}
            <div className="w-full bg-gray-900 text-white py-3 px-4 text-center relative">
              <h3 className="text-xl font-bold">{student.studentName}</h3>
            </div>

            {/* Level */}
            <div className="text-center relative">
              <p className="text-lg text-gray-700">{student.level}</p>
            </div>

            {/* Barcode */}
            <div className="relative">
              <Barcode 
                value={student.id} 
                width={2}
                height={60}
                fontSize={14}
                background="#FFFFFF"
                marginTop={0}
                marginBottom={0}
              />
            </div>

            {/* Footer */}
            <div className="w-full flex justify-center relative">
              <img 
                src="/mosque-logo.png" 
                alt="مسجد" 
                className="h-20 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={downloadCard}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        تحميل البطاقة
      </button>
    </div>
  );
}
