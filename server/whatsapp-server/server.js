const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// متغيرات لتخزين حالة QR
let currentQR = null;
let currentStatus = 'جاري التحميل...';

// إنشاء عميل واتساب
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
        defaultViewport: null
    }
});

// إنشاء نقطة نهاية للحصول على حالة QR
app.get('/qr-status', (req, res) => {
    res.json({
        qr: currentQR,
        status: currentStatus
    });
});

// عرض QR code للتسجيل
client.on('qr', (qr) => {
    currentQR = qr;
    currentStatus = 'يرجى مسح الرمز باستخدام تطبيق واتساب';
    console.log('تم إنشاء رمز QR جديد');
});

client.on('ready', () => {
    currentStatus = '✅ تم الاتصال بنجاح! يمكنك الآن إرسال الشهادات';
    console.log('WhatsApp client is ready!');
});

client.on('authenticated', () => {
    currentStatus = '✅ تم التحقق بنجاح!';
});

client.on('auth_failure', () => {
    currentStatus = '❌ فشل في التحقق!';
});

// API لإرسال الشهادة
app.post('/send-certificate', async (req, res) => {
    const { phone, image, message } = req.body;

    try {
        if (!client.info) {
            return res.status(500).json({ error: 'WhatsApp client not ready' });
        }

        // تنسيق رقم الهاتف
        const formattedPhone = phone.replace(/\D/g, '');
        const chatId = `${formattedPhone}@c.us`;

        // إرسال الرسالة النصية أولاً
        await client.sendMessage(chatId, message);

        // معالجة الصورة
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const media = new MessageMedia('image/jpeg', base64Data, 'certificate.jpg');
        
        // إرسال الصورة
        await client.sendMessage(chatId, media, { 
            caption: 'شهادة الشكر والتقدير'
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

// بدء تشغيل العميل والخادم
client.initialize();

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('افتح المتصفح على العنوان التالي لمسح رمز QR:');
    console.log(`http://localhost:${PORT}`);
});
