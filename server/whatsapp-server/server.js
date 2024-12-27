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
    console.log('Request headers:', req.headers);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
        if (!req.body || typeof req.body !== 'object') {
            console.error('Invalid request body:', req.body);
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const { phoneNumber, imageData } = req.body;
        
        console.log('Extracted data:', {
            phoneNumberExists: !!phoneNumber,
            phoneNumberType: typeof phoneNumber,
            phoneNumberValue: phoneNumber,
            imageDataExists: !!imageData,
            imageDataLength: imageData?.length
        });

        if (!phoneNumber || !imageData) {
            console.error('Missing required fields:', {
                hasPhone: !!phoneNumber,
                hasImage: !!imageData
            });
            return res.status(400).json({ error: 'Missing phone number or image data' });
        }

        if (typeof phoneNumber !== 'string') {
            console.error('Invalid phone number type:', typeof phoneNumber);
            return res.status(400).json({ error: 'Phone number must be a string' });
        }

        console.log('Processing phone number:', phoneNumber);
        let formattedNumber = phoneNumber.trim();
        console.log('After trim:', formattedNumber);
        
        formattedNumber = formattedNumber.replace(/\D/g, '');
        console.log('After removing non-digits:', formattedNumber);
        
        if (formattedNumber.startsWith('966')) {
            formattedNumber = formattedNumber.substring(3);
            console.log('After removing 966:', formattedNumber);
        }
        if (formattedNumber.startsWith('0')) {
            formattedNumber = formattedNumber.substring(1);
            console.log('After removing leading 0:', formattedNumber);
        }
        
        const finalNumber = `966${formattedNumber}@c.us`;
        console.log('Final formatted number:', finalNumber);

        console.log('Converting image data...');
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const media = new MessageMedia('image/png', base64Data, 'certificate.png');

        console.log('Checking WhatsApp client status...');
        if (!client.info) {
            console.error('WhatsApp client not ready');
            return res.status(500).json({ error: 'WhatsApp client not ready' });
        }

        console.log('Sending WhatsApp message...');
        const message = await client.sendMessage(finalNumber, media, {
            caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
        });
        
        console.log('Message sent successfully:', message);
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
