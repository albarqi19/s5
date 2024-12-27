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
        
        // التحقق من وجود req.body
        if (!req.body) {
            console.error('No request body received');
            return res.status(400).json({ error: 'No request body' });
        }

        console.log('Request body type:', typeof req.body);
        console.log('Request body keys:', Object.keys(req.body));
        
        const { phoneNumber, imageData } = req.body;
        
        console.log('Extracted data:', {
            phoneNumberType: typeof phoneNumber,
            phoneNumberValue: phoneNumber,
            hasImageData: !!imageData,
            imageDataType: typeof imageData,
            imageDataStartsWith: imageData?.substring(0, 30)
        });

        // التحقق من البيانات
        if (!phoneNumber || !imageData) {
            console.error('Missing required fields:', {
                hasPhone: !!phoneNumber,
                hasImage: !!imageData
            });
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
        console.log('Phone number before formatting:', formattedNumber);
        
        if (!formattedNumber.endsWith('@c.us')) {
            formattedNumber = `${formattedNumber}@c.us`;
        }
        console.log('Phone number after formatting:', formattedNumber);

        // التحقق من اتصال WhatsApp
        if (!client.info) {
            console.error('WhatsApp client not ready');
            return res.status(500).json({ error: 'WhatsApp client not ready' });
        }

        // إنشاء الوسائط
        console.log('Creating media from data URL...');
        const media = new MessageMedia('image/png', imageData.split(',')[1], 'certificate.png');
        console.log('Media created successfully');

        // إرسال الرسالة
        console.log('Sending message to:', formattedNumber);
        const message = await client.sendMessage(formattedNumber, media, {
            caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
        });

        console.log('Message sent successfully:', message.id);
        res.json({ success: true, messageId: message.id });

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
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
