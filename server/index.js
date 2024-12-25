import express from 'express';
import cors from 'cors';
import { sheets, spreadsheetId } from './config/sheets.js';
import studentsRouter from './routes/students.js';
import teachersRouter from './routes/teachers.js';
import recordsRouter from './routes/records.js';

console.log('=== Starting Server ===');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ status: 'ok' });
});

// Register routes
console.log('Registering routes...');
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/records', recordsRouter);

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server Error',
    details: err.message 
  });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=== Server running on port ${PORT} ===`);
  console.log('Available routes:');
  console.log('- GET /test');
  console.log('- GET /api/students');
  console.log('- GET /api/teachers');
  console.log('- GET /api/records');
});