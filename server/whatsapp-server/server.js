const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cors = require('cors');

const app = express();

// تكوين CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// معالجة خاصة لطلبات OPTIONS
app.options('*', cors());

// Middleware لمعالجة البيانات
app.use(express.json({
    limit: '100mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            console.error('Invalid JSON:', e);
            res.status(400).json({ error: 'Invalid JSON' });
            throw new Error('Invalid JSON');
        }
    }
}));

// Middleware للتحقق من البيانات
app.use('/send-certificate', (req, res, next) => {
    console.log('Request body received:', req.body);
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    next();
});

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
    console.log('=== Received certificate request ===');
    console.log('Request body:', req.body);
    
    try {
        const { phoneNumber, imageData } = req.body;

        if (!phoneNumber || !imageData) {
            console.error('Missing data:', { hasPhone: !!phoneNumber, hasImage: !!imageData });
            return res.status(400).json({ 
                error: 'Missing data',
                details: { hasPhone: !!phoneNumber, hasImage: !!imageData }
            });
        }

        // تنسيق رقم الهاتف
        const number = phoneNumber.toString().trim();
        console.log('Processing number:', number);

        // إنشاء الوسائط
        try {
            const base64Data = imageData.toString().replace(/^data:image\/\w+;base64,/, '');
            const media = new MessageMedia('image/png', base64Data, 'certificate.png');
            console.log('Media created successfully');

            // التحقق من اتصال WhatsApp
            if (!client.info) {
                throw new Error('WhatsApp client not ready');
            }

            // إرسال الرسالة
            const message = await client.sendMessage(`${number}@c.us`, media, {
                caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
            });

            console.log('Message sent successfully:', message.id);
            res.json({ success: true, messageId: message.id });
        } catch (mediaError) {
            console.error('Error processing media:', mediaError);
            throw new Error('Failed to process media: ' + mediaError.message);
        }
    } catch (error) {
        console.error('Error in send-certificate:', error);
        res.status(500).json({ 
            error: error.message,
            type: error.name,
            stack: error.stack
        });
    }
});

const port = 3002;

client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
