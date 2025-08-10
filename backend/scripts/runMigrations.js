require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'financemate',
    password: process.env.DB_PASSWORD || 'financemate',
    database: process.env.DB_NAME || 'financemate',
    multipleStatements: true
  });

  try {
    // Create migrations tracking table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of migration files
    const migrationDir = path.join(__dirname, 'migrations');
    let files = [];
    
    try {
      files = await fs.readdir(migrationDir);
      files = files.filter(f => f.endsWith('.sql')).sort();
    } catch (error) {
      console.log('No migrations directory found, skipping migrations');
      return;
    }

    // Get already executed migrations
    const [executed] = await connection.query('SELECT filename FROM migrations');
    const executedFiles = new Set(executed.map(row => row.filename));

    // Run new migrations
    let migrationsRun = 0;
    for (const file of files) {
      if (!executedFiles.has(file)) {
        const sqlFile = path.join(migrationDir, file);
        const sql = await fs.readFile(sqlFile, 'utf8');
        
        console.log(`Running migration: ${file}`);
        
        try {
          await connection.query(sql);
          await connection.query('INSERT INTO migrations (filename) VALUES (?)', [file]);
          console.log(`✅ ${file} completed successfully`);
          migrationsRun++;
        } catch (error) {
          // Handle specific errors gracefully
          if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
            console.log(`ℹ️  ${file} - Column or index already exists, marking as completed`);
            await connection.query('INSERT INTO migrations (filename) VALUES (?)', [file]);
          } else if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log(`ℹ️  ${file} - Column doesn't exist to drop, marking as completed`);
            await connection.query('INSERT INTO migrations (filename) VALUES (?)', [file]);
          } else {
            console.error(`❌ ${file} failed:`, error.message);
            throw error;
          }
        }
      }
    }

    if (migrationsRun === 0) {
      console.log('✅ All migrations are up to date');
    } else {
      console.log(`✅ Successfully ran ${migrationsRun} migration(s)`);
    }
    
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();