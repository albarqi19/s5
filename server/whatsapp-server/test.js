import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة صورة اختبار وتحويلها إلى base64
const testImage = fs.readFileSync(path.join(__dirname, 'test-certificate.png'));
const base64Image = `data:image/png;base64,${testImage.toString('base64')}`;

// بيانات الاختبار
const testData = {
    phoneNumber: '966530996778',  // الرقم المراد الإرسال إليه
    imageData: base64Image
};

// إرسال الطلب
async function testSendCertificate() {
    console.log('بدء اختبار إرسال الشهادة...');
    console.log(`إرسال إلى الرقم: ${testData.phoneNumber}`);
    
    try {
        const response = await fetch('http://164.92.246.226:3002/send-certificate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ تم إرسال الشهادة بنجاح!');
        } else {
            console.error('❌ فشل إرسال الشهادة:', result.error);
        }
    } catch (error) {
        console.error('❌ حدث خطأ:', error.message);
    }
}

testSendCertificate();
