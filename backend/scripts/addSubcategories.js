const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function addSubcategories() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'financemate',
      password: process.env.DB_PASSWORD || 'financemate123',
      database: process.env.DB_NAME || 'financemate',
      multipleStatements: true
    });

    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'add_subcategories.sql'),
      'utf8'
    );

    await connection.query(sqlScript);
    console.log('Subcategories added successfully');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Subcategory column already exists');
    } else {
      console.error('Error adding subcategories:', error);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addSubcategories();