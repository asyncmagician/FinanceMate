const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function applyMigration() {
  try {
    const sqlPath = path.join(__dirname, 'add_expense_sharing.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon to handle multiple statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.execute(statement);
          console.log('✅ Applied:', statement.substring(0, 50) + '...');
        } catch (err) {
          if (err.code === 'ER_DUP_COLUMN') {
            console.log('ℹ️  Column already exists');
          } else {
            throw err;
          }
        }
      }
    }
    
    console.log('✅ Migration applied successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();