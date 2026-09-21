const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  // Logika Register User Baru
  async register({ nama, email, password, role = 'operator' }) {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email sudah terdaftar!');
      error.statusCode = 400;
      throw error;
    }

    // 2. Hash password dengan bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Simpan ke database via Repository
    const userId = await userRepository.create({
      nama,
      email,
      password: hashedPassword,
      role
    });

    return userId;
  }

  // Logika Login User
  async login({ email, password }) {
    // 1. Cek keberadaan user via Repository
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Email atau password salah!');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verifikasi Password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Email atau password salah!');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT Access Token
    const tokenPayload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // 4. Return data hasil login tanpa mengirim hash password
    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();