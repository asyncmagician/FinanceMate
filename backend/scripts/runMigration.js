require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'financemate',
    password: process.env.DB_PASSWORD || 'financemate',
    database: process.env.DB_NAME || 'financemate',
    multipleStatements: true
  });

  try {
    const sqlFile = path.join(__dirname, 'add_subcategory_recurring.sql');
    const sql = await fs.readFile(sqlFile, 'utf8');
    
    console.log('Running migration: add_subcategory_recurring.sql');
    await connection.query(sql);
    console.log('✅ Migration completed successfully');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Subcategory column already exists');
    } else {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    await connection.end();
  }
}

runMigration();