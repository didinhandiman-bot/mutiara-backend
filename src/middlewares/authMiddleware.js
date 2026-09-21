const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Ambii header Authorization (Format: Bearer )
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak! Token tidak ditemukan.'
    });
  }

  try {
    // Verifikasi JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data payload token ke req.user
    next(); // Lanjut ke Controller
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa!'
    });
  }
};

module.exports = { verifyToken };