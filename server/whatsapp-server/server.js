import express from 'express';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let lastQR = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

// إنشاء مجلد public إذا لم يكن موجوداً
if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
}

// إنشاء صفحة HTML
const htmlContent = `
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>WhatsApp QR Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
        }
        .container {
            text-align: center;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        #qrcode {
            margin: 20px 0;
        }
        .status {
            margin-top: 20px;
            padding: 10px;
            border-radius: 5px;
        }
        .connected {
            background-color: #dcf8c6;
            color: #075e54;
        }
        .waiting {
            background-color: #fff3cd;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>مسح رمز QR</h1>
        <div id="qrcode"></div>
        <div id="status" class="status waiting">في انتظار المسح...</div>
    </div>
    <script>
        function checkStatus() {
            fetch('/status')
                .then(res => res.json())
                .then(data => {
                    const statusDiv = document.getElementById('status');
                    if (data.connected) {
                        statusDiv.textContent = 'متصل!';
                        statusDiv.className = 'status connected';
                    }
                });
        }

        function updateQR() {
            fetch('/qr')
                .then(res => res.json())
                .then(data => {
                    if (data.qr) {
                        document.getElementById('qrcode').innerHTML = '<img src="' + data.qr + '" alt="QR Code">';
                    }
                });
        }

        // تحديث كل 5 ثواني
        setInterval(() => {
            updateQR();
            checkStatus();
        }, 5000);

        // تحديث أول مرة
        updateQR();
        checkStatus();
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), htmlContent);

client.on('qr', async (qr) => {
    try {
        lastQR = await qrcode.toDataURL(qr);
        console.log('New QR Code received');
    } catch (err) {
        console.error('Error generating QR code:', err);
    }
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    lastQR = '';
});

// نقطة نهاية لحالة الاتصال
app.get('/status', (req, res) => {
    res.json({ connected: !!client.info });
});

// نقطة نهاية لرمز QR
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

        // تنسيق رقم الهاتف
        let formattedNumber = phoneNumber.toString().trim();
        if (!formattedNumber.endsWith('@c.us')) {
            formattedNumber = `${formattedNumber}@c.us`;
        }

        // إنشاء كائن MessageMedia من البيانات
        const media = new MessageMedia('image/png', imageData.split(',')[1]);

        // إرسال الصورة
        const chat = await client.getChatById(formattedNumber);
        await chat.sendMessage(media, {
            caption: 'شهادتك من برنامج نافس،بمجمع سعيد رداد القرآني'
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = 3002;

// قراءة شهادات SSL
const privateKey = fs.readFileSync(path.join(__dirname, 'certs', 'private.key'));
const certificate = fs.readFileSync(path.join(__dirname, 'certs', 'certificate.crt'));
const credentials = { key: privateKey, cert: certificate };

// إنشاء خادم HTTPS
const httpsServer = https.createServer(credentials, app);

console.log('Starting WhatsApp client...');
client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err);
});

httpsServer.listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
});
