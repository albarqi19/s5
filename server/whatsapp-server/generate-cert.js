import forge from 'node-forge';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إنشاء مجلد الشهادات إذا لم يكن موجوداً
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir);
}

// إنشاء زوج المفاتيح
const keys = forge.pki.rsa.generateKeyPair(2048);

// إنشاء شهادة
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
    name: 'commonName',
    value: '164.92.246.226'
}, {
    name: 'countryName',
    value: 'SA'
}, {
    shortName: 'ST',
    value: 'Riyadh'
}, {
    name: 'localityName',
    value: 'Riyadh'
}, {
    name: 'organizationName',
    value: 'Nafes'
}, {
    shortName: 'OU',
    value: 'Development'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

// حفظ المفتاح الخاص
const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
fs.writeFileSync(path.join(certsDir, 'private.key'), privateKeyPem);

// حفظ الشهادة
const certPem = forge.pki.certificateToPem(cert);
fs.writeFileSync(path.join(certsDir, 'certificate.crt'), certPem);

console.log('تم إنشاء الشهادات بنجاح!');
