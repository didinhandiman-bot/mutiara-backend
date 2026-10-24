import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './routes/authRoutes.js';
import laboratoriumRoutes from './routes/laboratoriumRoutes.js';
import regulasiRoutes from './routes/regulasiRoutes.js';
import registrasiMitraRoutes from './routes/registrasiMitra.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Definisikan array allowedOrigins terlebih dahulu
const allowedOrigins = [
  'https://bppmhkp.online',
  'http://localhost:5173',
  'http://192.168.9.152:5173',
  'http://192.168.9.151:5173',
  process.env.CLIENT_URL
].filter(Boolean);

// 2. Gunakan di middleware CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving untuk file publik (mis. PDF regulasi)
const storagePath = path.join(__dirname, '../public/storage');
console.log('[Static Storage] Serving files from:', storagePath);
app.use('/storage', express.static(storagePath));

// Health Check Route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API BPPMHKP Backend Running...' });
});

// API Routes Prefix
app.use('/auth', authRoutes);
app.use('/laboratorium', laboratoriumRoutes);
app.use('/regulasi', regulasiRoutes);
app.use('/registrasi-mitra', registrasiMitraRoutes);

// Error handler middleware (tangkap error dari next(error))
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err.original || err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    ...(process.env.NODE_ENV === 'development' && { detail: err.original || err }),
  });
});

export default app;
