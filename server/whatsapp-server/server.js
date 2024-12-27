const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// زيادة حد حجم الطلب
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));

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

app.post('/send-certificate', cors(), async (req, res) => {
    console.log('=== Received certificate request ===');
    
    try {
        // طباعة البيانات المستلمة
        console.log('Headers:', req.headers);
        console.log('Body:', {
            hasBody: !!req.body,
            bodyType: typeof req.body,
            keys: req.body ? Object.keys(req.body) : [],
            phoneNumber: req.body?.phoneNumber,
            hasImageData: !!req.body?.imageData
        });

        // التحقق من البيانات
        const { phoneNumber, imageData } = req.body || {};
        
        if (!phoneNumber || !imageData) {
            return res.status(400).json({
                error: 'Missing data',
                details: {
                    hasPhone: !!phoneNumber,
                    hasImage: !!imageData
                }
            });
        }

        // معالجة رقم الهاتف
        const cleanNumber = phoneNumber.trim();
        console.log('Phone number processing:', {
            original: phoneNumber,
            cleaned: cleanNumber
        });

        // إنشاء كائن الوسائط
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const media = new MessageMedia('image/png', base64Data, 'certificate.png');
        console.log('Media created successfully');

        // التحقق من حالة العميل
        if (!client.info) {
            console.error('WhatsApp client not ready');
            return res.status(500).json({ error: 'WhatsApp client not ready' });
        }

        // إرسال الرسالة
        console.log('Sending message to:', cleanNumber);
        const message = await client.sendMessage(`${cleanNumber}@c.us`, media, {
            caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
        });
        
        console.log('Message sent successfully:', message.id);
        res.json({ success: true, messageId: message.id });
    } catch (error) {
        console.error('Error in send-certificate:', error);
        res.status(500).json({ 
            error: error.message,
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
