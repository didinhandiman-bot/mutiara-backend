require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test koneksi ke MySQL
    const connection = await db.getConnection();
    console.log('✅ Terhubung ke Database MySQL!');
    connection.release();

    // Jalankan Server Express
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal terhubung ke Database MySQL:', error.message);
    process.exit(1);
  }
}

startServer();