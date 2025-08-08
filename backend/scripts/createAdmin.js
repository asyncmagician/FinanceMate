const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function createAdmin() {
  const args = process.argv.slice(2);
  const params = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    params[key] = value;
  }

  if (!params.email || !params.first || !params.last) {
    console.error('Usage: node createAdmin.js --email email@example.com --first FirstName --last LastName [--role admin]');
    process.exit(1);
  }

  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'financemate',
      password: process.env.DB_PASSWORD || 'financemate123',
      database: process.env.DB_NAME || 'financemate'
    });

    const password = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [params.email, hashedPassword, params.first, params.last, params.role || 'admin']
    );

    console.log('Admin user created successfully!');
    console.log('Email:', params.email);
    console.log('Temporary password:', password);
    console.log('Please change this password after first login.');

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('Error: User with this email already exists');
    } else {
      console.error('Error creating admin user:', error.message);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();