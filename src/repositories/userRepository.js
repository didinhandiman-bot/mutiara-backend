import db from '../config/database.js';
import bcrypt from 'bcrypt';

class UserRepository {
  // 1. Cari user berdasarkan email
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  // 2. Cari user berdasarkan ID
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, nama, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  // 3. Simpan user baru ke database
  async create({ nama, email, password, role = 'user' }) {
    const result = await db.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, password, role]
    );
    return result.insertId;
  }

  // 4. Update user
  async update(id, data) {
    const { nama, email, password, role } = data;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        'UPDATE users SET nama = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [nama, email, hashedPassword, role || 'user', id]
      );
      return { affectedRows: result.affectedRows };
    } else {
      const result = await db.query(
        'UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?',
        [nama, email, role || 'user', id]
      );
      return { affectedRows: result.affectedRows };
    }
  }

  // 5. Hapus user
  async delete(id) {
    const result = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return { affectedRows: result.affectedRows || 0 };
  }
}

export default new UserRepository();
