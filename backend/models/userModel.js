const pool = require('../config/database');

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