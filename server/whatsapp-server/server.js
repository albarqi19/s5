const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// إعدادات CORS المحدثة
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://s5-kappa.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, ngrok-skip-browser-warning');

    // معالجة طلبات OPTIONS
    if (req.method === 'OPTIONS') {
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

app.get('/qr', (req, res) => {
    res.send(lastQR);
});

app.post('/send-certificate', async (req, res) => {
    console.log('Received certificate request');
    try {
        const { phoneNumber, imageData } = req.body;
        
        if (!phoneNumber || !imageData) {
            console.error('Missing data:', { hasPhone: !!phoneNumber, hasImage: !!imageData });
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
        
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const media = new MessageMedia('image/png', base64Data, 'certificate.png');

        console.log('Sending WhatsApp message...');
        await client.sendMessage(finalNumber, media, {
            caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
        });
        
        console.log('Message sent successfully');
        res.json({ success: true });
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
