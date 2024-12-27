const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cors = require('cors');

const app = express();

// تكوين CORS
app.use(cors());

// معالجة البيانات
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
    console.log('New QR Code received');
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    lastQR = '';
});

client.on('authenticated', () => {
    console.log('WhatsApp client authenticated');
});

client.on('auth_failure', (msg) => {
    console.error('WhatsApp authentication failed:', msg);
});

app.get('/qr', (req, res) => {
    res.send(lastQR);
});

app.post('/send-certificate', async (req, res) => {
    try {
        console.log('=== Received certificate request ===');
        console.log('Request body:', {
            hasBody: !!req.body,
            keys: Object.keys(req.body || {}),
            phoneNumber: req.body?.phoneNumber,
            hasImageData: !!req.body?.imageData
        });

        const { phoneNumber, imageData } = req.body || {};

        // التحقق من البيانات
        if (!phoneNumber || !imageData) {
            return res.status(400).json({
                error: 'Missing required data',
                details: {
                    hasPhone: !!phoneNumber,
                    hasImage: !!imageData
                }
            });
        }

        // تنسيق رقم الهاتف
        let formattedNumber = String(phoneNumber).trim();
        if (!formattedNumber.endsWith('@c.us')) {
            formattedNumber = `${formattedNumber}@c.us`;
        }

        // التحقق من اتصال WhatsApp
        if (!client.info) {
            return res.status(500).json({ error: 'WhatsApp client not ready' });
        }

        // إنشاء الوسائط
        const media = MessageMedia.fromDataURL(imageData);

        // إرسال الرسالة
        const message = await client.sendMessage(formattedNumber, media, {
            caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
        });

        console.log('Message sent successfully:', message.id);
        res.json({ success: true, messageId: message.id });

    } catch (error) {
        console.error('Error in send-certificate:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = 3002;

client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
