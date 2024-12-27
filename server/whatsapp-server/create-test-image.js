import canvas from 'canvas';
import fs from 'fs';

// إنشاء صورة اختبار
const { createCanvas } = canvas;
const cvs = createCanvas(800, 600);
const ctx = cvs.getContext('2d');

// تعيين خلفية بيضاء
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 800, 600);

// إضافة نص
ctx.fillStyle = 'black';
ctx.font = '30px Arial';
ctx.textAlign = 'center';
ctx.fillText('شهادة اختبار', 400, 200);
ctx.fillText('هذه شهادة اختبار لنظام واتساب', 400, 300);
ctx.fillText(new Date().toLocaleDateString('ar'), 400, 400);

// حفظ الصورة
const buffer = cvs.toBuffer('image/png');
fs.writeFileSync('test-certificate.png', buffer);
