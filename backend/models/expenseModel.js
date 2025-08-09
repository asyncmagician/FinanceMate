const pool = require('../config/database');

exports.findById = async (id) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, month_id, category_id, subcategory, description, 
              amount, is_deducted, is_received,
              DATE_FORMAT(date, '%Y-%m-%d') as date
       FROM expenses WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.getByMonth = async (monthId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.id, e.month_id, e.category_id, e.subcategory, e.description, 
              e.amount, e.is_deducted, e.is_received,
              DATE_FORMAT(e.date, '%Y-%m-%d') as date,
              c.name as category_name, c.type as category_type 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.month_id = ? 
       ORDER BY e.subcategory, e.date DESC`,
      [monthId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.create = async (expenseData) => {
  try {
    const { month_id, category_id, subcategory, description, amount, is_deducted, is_received, date } = expenseData;
    const [result] = await pool.execute(
      'INSERT INTO expenses (month_id, category_id, subcategory, description, amount, is_deducted, is_received, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [month_id, category_id, subcategory || null, description, amount, is_deducted || false, is_received || false, date]
    );
    return { id: result.insertId, ...expenseData };
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, expenseData) => {
  try {
    const fields = [];
    const values = [];
    
    Object.keys(expenseData).forEach(key => {
      if (key !== 'id' && expenseData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(expenseData[key]);
      }
    });
    
    values.push(id);
    
    await pool.execute(
      `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return exports.findById(id);
  } catch (error) {
    throw error;
  }
};

exports.delete = async (id) => {
  try {
    await pool.execute('DELETE FROM expenses WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getRecurring = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, c.name as category_name, c.type as category_type 
       FROM recurring_expenses r 
       JOIN categories c ON r.category_id = c.id 
       WHERE r.user_id = ? AND r.is_active = true 
       ORDER BY r.day_of_month`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.getRecurringForMonth = async (userId, year, month) => {
  try {
    const monthDate = new Date(year, month - 1, 1);
    const [rows] = await pool.execute(
      `SELECT r.*, c.name as category_name, c.type as category_type 
       FROM recurring_expenses r 
       JOIN categories c ON r.category_id = c.id 
       WHERE r.user_id = ? 
       AND r.is_active = true 
       AND r.start_date <= ? 
       AND (r.end_date IS NULL OR r.end_date >= ?)`,
      [userId, monthDate, monthDate]
    );
    
    return rows.map(recurring => ({
      ...recurring,
      date: new Date(year, month - 1, recurring.day_of_month),
      is_recurring: true
    }));
  } catch (error) {
    throw error;
  }
};

exports.findRecurringById = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM recurring_expenses WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

exports.createRecurring = async (recurringData) => {
  try {
    const { user_id, category_id, subcategory, description, amount, day_of_month, start_date, end_date, share_type, share_value, share_with } = recurringData;
    const [result] = await pool.execute(
      'INSERT INTO recurring_expenses (user_id, category_id, subcategory, description, amount, share_type, share_value, share_with, day_of_month, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, category_id, subcategory || null, description, amount, share_type || 'none', share_value || null, share_with || null, day_of_month || 1, start_date, end_date || null]
    );
    return { id: result.insertId, ...recurringData };
  } catch (error) {
    throw error;
  }
};

exports.updateRecurring = async (id, recurringData) => {
  try {
    const fields = [];
    const values = [];
    
    Object.keys(recurringData).forEach(key => {
      if (key !== 'id' && recurringData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(recurringData[key]);
      }
    });
    
    values.push(id);
    
    await pool.execute(
      `UPDATE recurring_expenses SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return exports.findRecurringById(id);
  } catch (error) {
    throw error;
  }
};

exports.deleteRecurring = async (id) => {
  try {
    await pool.execute('DELETE FROM recurring_expenses WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.deleteByMonth = async (monthId) => {
  try {
    await pool.execute('DELETE FROM expenses WHERE month_id = ?', [monthId]);
    return true;
  } catch (error) {
    throw error;
  }
};

exports.deleteRecurringByUser = async (userId) => {
  try {
    await pool.execute('DELETE FROM recurring_expenses WHERE user_id = ?', [userId]);
    return true;
  } catch (error) {
    throw error;
  }
};

// Get all expenses for a user (for export)
exports.getAllByUser = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, c.name as category_name, c.type as category_type 
       FROM expenses e 
       JOIN months m ON e.month_id = m.id 
       JOIN categories c ON e.category_id = c.id 
       WHERE m.user_id = ? 
       ORDER BY e.date DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get all recurring expenses for a user (for export)
exports.getRecurringByUser = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, c.name as category_name, c.type as category_type 
       FROM recurring_expenses r 
       JOIN categories c ON r.category_id = c.id 
       WHERE r.user_id = ? 
       ORDER BY r.day_of_month`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};