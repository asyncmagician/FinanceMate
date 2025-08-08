const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: 'root',
      password: process.env.DB_ROOT_PASSWORD || 'rootpassword',
      multipleStatements: true
    });

    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    await connection.query(sqlScript);
    console.log('Database initialized successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();