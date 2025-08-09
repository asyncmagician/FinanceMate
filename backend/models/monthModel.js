const pool = require('../config/database');

exports.findById = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM months WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.findByYearMonth = async (userId, year, month) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM months WHERE user_id = ? AND year = ? AND month = ?',
      [userId, year, month]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.findOrCreate = async (userId, year, month) => {
  try {
    const existing = await exports.findByYearMonth(userId, year, month);
    if (existing) {
      return existing;
    }
    
    try {
      return await exports.create({
        user_id: userId,
        year,
        month,
        starting_balance: 0
      });
    } catch (createError) {
      // If we get a duplicate entry error, try to fetch again
      // This handles race conditions where multiple requests create the same month
      if (createError.code === 'ER_DUP_ENTRY') {
        const existingAfterError = await exports.findByYearMonth(userId, year, month);
        if (existingAfterError) {
          return existingAfterError;
        }
      }
      throw createError;
    }
  } catch (error) {
    throw error;
  }
};

exports.getAllByUser = async (userId) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM months WHERE user_id = ? ORDER BY year DESC, month DESC',
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.create = async (monthData) => {
  try {
    const { user_id, year, month, starting_balance } = monthData;
    const [result] = await pool.execute(
      'INSERT INTO months (user_id, year, month, starting_balance) VALUES (?, ?, ?, ?)',
      [user_id, year, month, starting_balance || 0]
    );
    return { id: result.insertId, ...monthData };
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, monthData) => {
  try {
    const fields = [];
    const values = [];
    
    Object.keys(monthData).forEach(key => {
      if (key !== 'id' && monthData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(monthData[key]);
      }
    });
    
    values.push(id);
    
    await pool.execute(
      `UPDATE months SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return exports.findById(id);
  } catch (error) {
    throw error;
  }
};

exports.getByUser = async (userId) => {
  return exports.getAllByUser(userId);
};

exports.deleteByUser = async (userId) => {
  try {
    await pool.execute('DELETE FROM months WHERE user_id = ?', [userId]);
    return true;
  } catch (error) {
    throw error;
  }
};