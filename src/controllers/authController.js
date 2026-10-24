import db from '../config/database.js';
import authService from '../services/authService.js';
import userRepository from '../repositories/userRepository.js';

class AuthController {
  // 1. Controller Register
  async register(req, res) {
    try {
      const { nama, email, password } = req.body;

      if (!nama || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nama, email, dan password wajib diisi!'
        });
      }

      const newUser = await authService.register({ nama, email, password });

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil!',
        data: newUser
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan pada server'
      });
    }
  }

  // 2. Controller Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password wajib diisi!'
        });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login berhasil!',
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan pada server'
      });
    }
  }

  // 3. Controller Get Profile (Halaman Terproteksi)
  async getMe(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Data profil berhasil diambil',
        data: req.user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 4. Controller Get All Users (dengan pagination)
  async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Ambil total count
      const [countRows] = await db.query('SELECT COUNT(*) as total FROM users');
      const total = countRows[0].total;

      // Ambil user dengan excludes password
      const [rows] = await db.query(
        `SELECT id, nama, email, role, created_at FROM users ORDER BY id ASC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      // Format tanggal ke YYYY-MM-DD
      const users = rows.map(user => ({
        ...user,
        created_at: new Date(user.created_at).toISOString().split('T')[0],
        status: user.role === 'admin' ? 'Aktif' : 'Aktif'
      }));

      return res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: page,
            pageSize: limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getUsers:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data user'
      });
    }
  }

  // 5. Controller Create User
  async createUser(req, res) {
    try {
      const { nama, email, password, role } = req.body;

      if (!nama || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nama, email, dan password wajib diisi!'
        });
      }

      const validRoles = ['admin', 'operator', 'viewer'];
      const userRole = validRoles.includes(role) ? role : 'operator';

      const userId = await authService.register({ nama, email, password, role: userRole });

      const newUser = await userRepository.findById(userId);

      return res.status(201).json({
        success: true,
        message: 'User berhasil ditambahkan',
        data: newUser
      });
    } catch (error) {
      console.error('Error createUser:', error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Gagal membuat user baru'
      });
    }
  }

  // 6. Controller Update User
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nama, email, password, role } = req.body;

      if (!nama || !email) {
        return res.status(400).json({
          success: false,
          message: 'Nama dan email wajib diisi!'
        });
      }

      const validRoles = ['admin', 'operator', 'viewer'];
      const userRole = validRoles.includes(role) ? role : 'operator';

      const result = await userRepository.update(parseInt(id), {
        nama,
        email,
        password: password || undefined,
        role: userRole
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      const updatedUser = await userRepository.findById(parseInt(id));

      return res.status(200).json({
        success: true,
        message: 'User berhasil diupdate',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error updateUser:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupdate user'
      });
    }
  }

  // 7. Controller Delete User
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const affectedRows = await userRepository.delete(parseInt(id));

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User berhasil dihapus'
      });
    } catch (error) {
      console.error('Error deleteUser:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus user'
      });
    }
  }
}

export default new AuthController();
