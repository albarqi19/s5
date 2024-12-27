const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

let lastQR = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

client.on('qr', (qr) => {
    lastQR = qr;
    console.log('\n\n=========================');
    console.log('Scan this QR code in WhatsApp:');
    console.log('=========================\n\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n=========================');
    console.log('WhatsApp client is ready!');
    console.log('=========================\n');
    lastQR = '';
});

client.on('authenticated', () => {
    console.log('\n=========================');
    console.log('WhatsApp client authenticated');
    console.log('=========================\n');
});

client.on('auth_failure', (msg) => {
    console.error('\n=========================');
    console.error('WhatsApp authentication failed:', msg);
    console.error('=========================\n');
});

// إضافة نقطة نهاية للحصول على رمز QR
app.get('/qr', (req, res) => {
    if (lastQR) {
        res.json({ qr: lastQR });
    } else {
        res.status(404).json({ error: 'No QR code available' });
    }
});

app.post('/send-certificate', async (req, res) => {
    try {
        const { phoneNumber, imageData } = req.body;

        if (!phoneNumber || !imageData) {
            return res.status(400).json({ error: 'Missing phone number or image data' });
        }

        if (!client.info) {
            return res.status(500).json({ error: 'WhatsApp client not ready. Please scan the QR code first.' });
        }

        // حفظ الصورة مؤقتاً
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const tempFilePath = './temp_certificate.png';
        
        fs.writeFileSync(tempFilePath, base64Data, 'base64');

        // تنسيق رقم الهاتف
        let formattedNumber = phoneNumber.toString().trim();
        if (!formattedNumber.endsWith('@c.us')) {
            formattedNumber = `${formattedNumber}@c.us`;
        }

        // إرسال الصورة
        const chat = await client.getChatById(formattedNumber);
        await chat.sendMessage('شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني', {
            media: fs.readFileSync(tempFilePath)
        });

        // حذف الملف المؤقت
        fs.unlinkSync(tempFilePath);

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = 3002;

console.log('\n=========================');
console.log('Starting WhatsApp client...');
console.log('=========================\n');

client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
