import React from 'react';
import { useThemeStore } from '../../store/themeStore';

export type CertificateDesign = 'classic' | 'modern' | 'premium' | 'simple';

interface CertificateSelectorProps {
  selectedDesign: CertificateDesign;
  onSelectDesign: (design: CertificateDesign) => void;
}

// مصفوفة تصاميم الشهادات المتاحة
const certificateDesigns = [
  { id: 'classic', name: 'كلاسيكي', description: 'تصميم كلاسيكي بخلفية صفراء وزخارف تقليدية', bgColor: 'bg-yellow-50 border-yellow-600' },
  { id: 'modern', name: 'عصري', description: 'تصميم عصري بخلفية بيضاء وألوان زاهية', bgColor: 'bg-white border-blue-600' },
  { id: 'premium', name: 'مميز', description: 'تصميم مميز للطلاب المتفوقين بخلفية ذهبية', bgColor: 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-800' },
  { id: 'simple', name: 'بسيط', description: 'تصميم بسيط بخطوط أنيقة ومظهر نظيف', bgColor: 'bg-gray-50 border-gray-500' },
];

export function CertificateSelector({ selectedDesign, onSelectDesign }: CertificateSelectorProps) {
  const { isDark } = useThemeStore();
  
  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} mb-6`}>
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        اختر تصميم الشهادة
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {certificateDesigns.map((design) => (
          <div
            key={design.id}
            onClick={() => onSelectDesign(design.id as CertificateDesign)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all
              ${selectedDesign === design.id 
                ? `${isDark ? 'border-blue-500 bg-blue-900/30' : 'border-blue-500 bg-blue-50'}`
                : `border-transparent ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
              }
            `}
          >
            <div className={`w-full h-20 mb-3 rounded border-4 ${design.bgColor} flex items-center justify-center`}>
              <span className={`text-sm ${design.id === 'premium' ? 'text-yellow-800' : ''}`}>معاينة</span>
            </div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{design.name}</h4>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {design.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}