import express from 'express';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import fetch from 'node-fetch';

// تهيئة المتغيرات البيئية
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تعريف مسار ملف البيانات
const DATA_FILE = path.join(__dirname, 'whatsapp_data.json');

// دالة تسجيل السجلات
function logToFile(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}\n`;
    console.log(logMessage);
    fs.appendFileSync('whatsapp.log', logMessage);
}

// دالة تحميل البيانات
async function loadData() {
    try {
        if (await fs.pathExists(DATA_FILE)) {
            const data = await fs.readJson(DATA_FILE);
            whatsappClients.clear();
            
            for (const [id, savedData] of Object.entries(data)) {
                const client = new Client({
                    puppeteer: {
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    }
                });

                // إعادة تعيين مستمعي الأحداث
                setupClientEvents(client, id);

                whatsappClients.set(id, {
                    client,
                    status: 'disconnected',
                    webhooks: savedData.webhooks || [],
                    createdAt: new Date(savedData.createdAt)
                });

                // إعادة الاتصال
                try {
                    await client.initialize();
                } catch (error) {
                    logToFile(`Error initializing client ${id}: ${error.message}`, 'error');
                }
            }
            logToFile(`Loaded ${whatsappClients.size} clients from storage`, 'info');
        }
    } catch (error) {
        logToFile(`Error loading data: ${error.message}`, 'error');
    }
}

// دالة حفظ البيانات
async function saveData() {
    try {
        const data = {};
        for (const [id, clientData] of whatsappClients.entries()) {
            data[id] = {
                webhooks: clientData.webhooks || [],
                createdAt: clientData.createdAt,
                status: clientData.status
            };
        }
        await fs.writeJson(DATA_FILE, data, { spaces: 2 });
        logToFile('Data saved successfully', 'info');
    } catch (error) {
        logToFile(`Error saving data: ${error.message}`, 'error');
    }
}

// دالة إعداد أحداث العميل
function setupClientEvents(client, clientId) {
    client.on('qr', async (qrCode) => {
        try {
            const qrUrl = await qrcode.toDataURL(qrCode);
            const clientData = whatsappClients.get(clientId);
            if (clientData) {
                clientData.qr = qrUrl;
                clientData.status = 'qr_ready';
                whatsappClients.set(clientId, clientData);
                await saveData();
            }
            logToFile(`QR Code generated for client ${clientId}`, 'qr');
        } catch (error) {
            logToFile(`QR Error: ${error.message}`, 'error');
        }
    });

    client.on('ready', async () => {
        logToFile(`Client ${clientId} is ready!`, 'status');
        const clientData = whatsappClients.get(clientId);
        if (clientData) {
            clientData.status = 'ready';
            whatsappClients.set(clientId, clientData);
            await saveData();
        }
    });

    client.on('authenticated', async () => {
        logToFile(`Client ${clientId} authenticated`, 'status');
        const clientData = whatsappClients.get(clientId);
        if (clientData) {
            clientData.status = 'authenticated';
            whatsappClients.set(clientId, clientData);
            await saveData();
        }
    });

    client.on('auth_failure', async (msg) => {
        logToFile(`Client ${clientId} auth failure: ${msg}`, 'error');
        const clientData = whatsappClients.get(clientId);
        if (clientData) {
            clientData.status = 'auth_failure';
            whatsappClients.set(clientId, clientData);
            await saveData();
        }
    });

    // تابع دالة setupClientEvents
    client.on('message', async (message) => {
        logToFile(`New message received for client ${clientId}: ${JSON.stringify(message)}`, 'message');
        const clientData = whatsappClients.get(clientId);
        if (clientData && clientData.webhooks) {
            for (const webhook of clientData.webhooks) {
                if (webhook.events.includes('message')) {
                    try {
                        const webhookData = {
                            type: 'message',
                            clientId,
                            data: {
                                from: message.from,
                                body: message.body,
                                timestamp: message.timestamp,
                                type: message.type
                            }
                        };
                        
                        logToFile(`Sending webhook data: ${JSON.stringify(webhookData)}`, 'webhook');
                        
                        const response = await fetch(webhook.url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(webhookData)
                        });
                        
                        const responseText = await response.text();
                        logToFile(`Webhook response: ${response.status} ${responseText}`, 'webhook');
                    } catch (error) {
                        logToFile(`Webhook error: ${error.message}`, 'error');
                    }
                }
            }
        }
    });

    client.on('message_ack', async (message, ack) => {
        logToFile(`Message ACK received for client ${clientId}`, 'ack');
        const clientData = whatsappClients.get(clientId);
        if (clientData && clientData.webhooks) {
            for (const webhook of clientData.webhooks) {
                if (webhook.events.includes('message_ack')) {
                    try {
                        const webhookData = {
                            type: 'message_ack',
                            clientId,
                            data: {
                                messageId: message.id,
                                ack,
                                timestamp: new Date().toISOString()
                            }
                        };

                        const response = await fetch(webhook.url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(webhookData)
                        });
                        
                        const responseText = await response.text();
                        logToFile(`Webhook ACK response: ${response.status} ${responseText}`, 'webhook');
                    } catch (error) {
                        logToFile(`Webhook ACK error: ${error.message}`, 'error');
                    }
                }
            }
        }
    });

    client.on('disconnected', async () => {
        logToFile(`Client ${clientId} disconnected`, 'status');
        const clientData = whatsappClients.get(clientId);
        if (clientData) {
            clientData.status = 'disconnected';
            whatsappClients.set(clientId, clientData);
            await saveData();
        }
    });
}

// إنشاء تطبيق Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// تخزين عملاء WhatsApp
const whatsappClients = new Map();

// المصادقة الأساسية
const checkAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required');
    }
    
    const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    const username = credentials[0];
    const password = credentials[1];
    
    if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Invalid credentials');
    }
};

// المسارات الرئيسية
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html'));
});

// API مسارات
app.post('/api/whatsapp/create', checkAuth, async (req, res) => {
    try {
        const clientId = Date.now().toString();
        const client = new Client({
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        setupClientEvents(client, clientId);

        whatsappClients.set(clientId, { 
            client,
            status: 'initializing',
            webhooks: [],
            createdAt: new Date()
        });

        await saveData();
        await client.initialize();
        res.json({ clientId });
    } catch (error) {
        logToFile(`Error creating client: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/whatsapp/status/:clientId', checkAuth, (req, res) => {
    try {
        const clientData = whatsappClients.get(req.params.clientId);
        if (!clientData) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({
            status: clientData.status,
            qr: clientData.qr,
            phoneNumber: clientData.client.info ? clientData.client.info.wid.user : null
        });
    } catch (error) {
        logToFile(`Error getting status: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/whatsapp/clients', checkAuth, (req, res) => {
    try {
        const clients = Array.from(whatsappClients.entries()).map(([id, data]) => ({
            id,
            status: data.status,
            phoneNumber: data.client.info ? data.client.info.wid.user : 'جاري التحميل...',
            webhooks: data.webhooks || [],
            createdAt: data.createdAt
        }));
        res.json(clients);
    } catch (error) {
        logToFile(`Error getting clients: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/whatsapp/client/:clientId', checkAuth, async (req, res) => {
    try {
        const clientData = whatsappClients.get(req.params.clientId);
        if (!clientData) {
            return res.status(404).json({ error: 'Client not found' });
        }

        if (clientData.client) {
            try {
                await clientData.client.destroy();
            } catch (destroyError) {
                logToFile(`Error destroying client: ${destroyError.message}`, 'error');
            }
        }

        whatsappClients.delete(req.params.clientId);
        await saveData();
        res.json({ success: true });
    } catch (error) {
        logToFile(`Error deleting client: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/whatsapp/client/:clientId/webhook', checkAuth, async (req, res) => {
    try {
        const clientData = whatsappClients.get(req.params.clientId);
        if (!clientData) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const { url, events } = req.body;
        if (!url || !events || !Array.isArray(events)) {
            return res.status(400).json({ error: 'Invalid webhook data' });
        }

        const webhook = {
            id: Date.now().toString(),
            url,
            events
        };

        clientData.webhooks = clientData.webhooks || [];
        clientData.webhooks.push(webhook);
        whatsappClients.set(req.params.clientId, clientData);
        await saveData();

        logToFile(`Webhook added for client ${req.params.clientId}: ${url}`, 'webhook');
        res.json(webhook);
    } catch (error) {
        logToFile(`Error adding webhook: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/whatsapp/client/:clientId/webhooks', checkAuth, (req, res) => {
    try {
        const clientData = whatsappClients.get(req.params.clientId);
        if (!clientData) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(clientData.webhooks || []);
    } catch (error) {
        logToFile(`Error getting webhooks: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/whatsapp/client/:clientId/webhook/:webhookId', checkAuth, async (req, res) => {
    try {
        const clientData = whatsappClients.get(req.params.clientId);
        if (!clientData) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const webhookIndex = clientData.webhooks?.findIndex(w => w.id === req.params.webhookId);
        if (webhookIndex === -1) {
            return res.status(404).json({ error: 'Webhook not found' });
        }

        clientData.webhooks.splice(webhookIndex, 1);
        whatsappClients.set(req.params.clientId, clientData);
        await saveData();

        logToFile(`Webhook deleted for client ${req.params.clientId}`, 'webhook');
        res.json({ success: true });
    } catch (error) {
        logToFile(`Error deleting webhook: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3004;
const startServer = async () => {
    try {
        // تحميل البيانات عند بدء التشغيل
        await loadData();
        
        app.listen(PORT, () => {
            logToFile(`Server running on port ${PORT}`, 'server');
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                logToFile(`Port ${PORT} is already in use. Please try another port or free up this port.`, 'error');
                process.exit(1);
            } else {
                logToFile(`Server error: ${err.message}`, 'error');
            }
        });
    } catch (error) {
        logToFile(`Failed to start server: ${error.message}`, 'error');
        process.exit(1);
    }
};

// معالجة الإغلاق بأمان
process.on('SIGTERM', async () => {
    logToFile('SIGTERM received. Closing all WhatsApp clients...', 'server');
    await saveData();
    for (const [clientId, clientData] of whatsappClients.entries()) {
        try {
            await clientData.client.destroy();
        } catch (error) {
            logToFile(`Error destroying client ${clientId}: ${error.message}`, 'error');
        }
    }
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    logToFile(`Uncaught Exception: ${err.message}`, 'error');
    await saveData();
});

process.on('unhandledRejection', async (reason, promise) => {
    logToFile(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
    await saveData();
});

startServer();