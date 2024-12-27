const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// إعدادات CORS المحدثة
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.path);
    console.log('Request headers:', req.headers);
    
    res.header('Access-Control-Allow-Origin', 'https://s5-kappa.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, ngrok-skip-browser-warning');

    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        return res.status(200).end();
    }
    next();
});

// زيادة حد حجم الطلب
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

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
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body));
    
    try {
        const { phoneNumber, imageData } = req.body;
        
        if (!phoneNumber || !imageData) {
            console.error('Missing data:', { 
                hasPhone: !!phoneNumber, 
                hasImage: !!imageData,
                phoneType: typeof phoneNumber,
                imageType: typeof imageData
            });
            return res.status(400).json({ error: 'Missing phone number or image data' });
        }

        console.log('Processing phone number:', phoneNumber);
        
        let formattedNumber = phoneNumber.replace(/\D/g, '');
        if (formattedNumber.startsWith('966')) {
            formattedNumber = formattedNumber.substring(3);
        }
        if (formattedNumber.startsWith('0')) {
            formattedNumber = formattedNumber.substring(1);
        }
        const finalNumber = `966${formattedNumber}@c.us`;
        
        console.log('Formatted number:', finalNumber);
        console.log('Image data length:', imageData.length);
        
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const media = new MessageMedia('image/png', base64Data, 'certificate.png');

        console.log('Attempting to send WhatsApp message...');
        
        // تحقق من حالة العميل
        if (!client.info) {
            console.error('WhatsApp client not ready');
            return res.status(500).json({ error: 'WhatsApp client not ready' });
        }

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
