#!/usr/bin/env node

const { generateEncryptionKey } = require('../services/encryptionService');

console.log('');
console.log('🔐 FinanceMate - Encryption Key Generator');
console.log('=========================================');
console.log('');
console.log('Generated encryption key for salary encryption:');
console.log('');
console.log(generateEncryptionKey());
console.log('');
console.log('⚠️  IMPORTANT SECURITY NOTICE:');
console.log('1. Add this key to your backend/.env file as: ENCRYPTION_KEY=<generated_key>');
console.log('2. Keep this key secret and secure');
console.log('3. NEVER commit this key to version control');
console.log('4. Back up this key safely - without it, encrypted salary data cannot be decrypted');
console.log('5. Use the same key across all environments for data consistency');
console.log('');
console.log('⚡ Next steps:');
console.log('1. Add the key to backend/.env');
console.log('2. Run the database migration: npm run db:migrate');
console.log('3. Restart your backend server');
console.log('');