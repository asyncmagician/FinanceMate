const pool = require('../config/database');
const { encryptSalary, decryptSalary } = require('../services/encryptionService');

exports.findByEmail = async (email) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.findById = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.create = async (userData) => {
  try {
    const { email, password, firstName, lastName, role } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, password, firstName, lastName, role || 'user']
    );
    return { id: result.insertId, email, first_name: firstName, last_name: lastName, role: role || 'user' };
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, userData) => {
  try {
    const fields = [];
    const values = [];
    
    Object.keys(userData).forEach(key => {
      if (key !== 'id' && userData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });
    
    values.push(id);
    
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return exports.findById(id);
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (id, hashedPassword) => {
  try {
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

exports.deleteById = async (id) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.updateLastLogin = async (id) => {
  try {
    await pool.execute(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, first_name, last_name, role, created_at, last_login 
       FROM users 
       ORDER BY created_at DESC`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.updateSalary = async (id, salary) => {
  try {
    const encryptedSalary = salary ? encryptSalary(salary) : null;
    await pool.execute(
      'UPDATE users SET encrypted_salary = ? WHERE id = ?',
      [encryptedSalary, id]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getSalary = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT encrypted_salary FROM users WHERE id = ?',
      [id]
    );
    
    if (!rows[0] || !rows[0].encrypted_salary) {
      return null;
    }
    
    return decryptSalary(rows[0].encrypted_salary);
  } catch (error) {
    throw error;
  }
};

exports.findByIdWithSalary = async (id) => {
  try {
    const user = await exports.findById(id);
    if (!user) return null;
    
    // Add decrypted salary to user object (only for the user themselves)
    const salary = await exports.getSalary(id);
    user.salary = salary;
    
    return user;
  } catch (error) {
    throw error;
  }
};

exports.getEmailPreferences = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        email_notifications,
        email_budget_alerts,
        email_weekly_summary,
        email_consent_date,
        email_unsubscribe_token
      FROM users WHERE id = ?`,
      [userId]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.updateEmailPreferences = async (userId, preferences) => {
  try {
    const fields = [];
    const values = [];
    
    Object.keys(preferences).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(preferences[key]);
    });
    
    values.push(userId);
    
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return true;
  } catch (error) {
    throw error;
  }
};

exports.findByUnsubscribeToken = async (token) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email FROM users WHERE email_unsubscribe_token = ?',
      [token]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.generateUnsubscribeToken = async (userId) => {
  try {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    
    await pool.execute(
      'UPDATE users SET email_unsubscribe_token = ? WHERE id = ?',
      [token, userId]
    );
    
    return token;
  } catch (error) {
    throw error;
  }
};