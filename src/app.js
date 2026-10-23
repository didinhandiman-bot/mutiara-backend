const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const laboratoriumRoutes = require('./routes/laboratoriumRoutes');

const app = express();

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

// Health Check Route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API BPPMHKP Backend Running...' });
});

// API Routes Prefix
app.use('/auth', authRoutes);
app.use('/laboratorium', laboratoriumRoutes);

module.exports = app;
