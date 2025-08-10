const crypto = require('crypto');

// AES-256-GCM encryption for maximum security
const algorithm = 'aes-256-gcm';
const keyLength = 32; // 256 bits

// Get encryption key from environment variable or generate a warning
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required for salary encryption');
  }
  
  if (key.length !== keyLength * 2) { // Hex string should be 64 chars for 32 bytes
    throw new Error(`ENCRYPTION_KEY must be ${keyLength * 2} characters (${keyLength} bytes in hex format)`);
  }
  
  return Buffer.from(key, 'hex');
};

/**
 * Encrypt a salary value
 * @param {number|string} salary - The salary to encrypt
 * @returns {string} - Base64 encoded encrypted data with format: iv:authTag:encryptedData
 */
exports.encryptSalary = (salary) => {
  try {
    if (!salary || salary === '' || salary === null || salary === undefined) {
      return null;
    }
    
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16); // 128-bit IV for GCM
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    cipher.setAAD(Buffer.from('salary', 'utf8')); // Additional authenticated data
    
    const salaryString = String(salary);
    let encrypted = cipher.update(salaryString, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encryptedData (all base64 encoded, separated by colons)
    const result = `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
    return result;
  } catch (error) {
    console.error('Salary encryption error:', error.message);
    throw new Error('Failed to encrypt salary data');
  }
};

/**
 * Decrypt a salary value
 * @param {string} encryptedSalary - The encrypted salary data
 * @returns {number|null} - The decrypted salary as a number, or null if empty
 */
exports.decryptSalary = (encryptedSalary) => {
  try {
    if (!encryptedSalary || encryptedSalary === '' || encryptedSalary === null) {
      return null;
    }
    
    const key = getEncryptionKey();
    const parts = encryptedSalary.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted salary format');
    }
    
    const [ivBase64, authTagBase64, encryptedBase64] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    const encrypted = Buffer.from(encryptedBase64, 'base64');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAAD(Buffer.from('salary', 'utf8'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    const salaryString = decrypted.toString('utf8');
    const salary = parseFloat(salaryString);
    
    return isNaN(salary) ? null : salary;
  } catch (error) {
    console.error('Salary decryption error:', error.message);
    throw new Error('Failed to decrypt salary data');
  }
};

/**
 * Generate a new encryption key for the .env file
 * This function is for setup/administration purposes only
 * @returns {string} - A hex-encoded 32-byte key
 */
exports.generateEncryptionKey = () => {
  return crypto.randomBytes(keyLength).toString('hex');
};

/**
 * Validate if encryption is properly configured
 * @returns {boolean} - True if encryption is ready to use
 */
exports.validateEncryptionSetup = () => {
  try {
    getEncryptionKey();
    return true;
  } catch (error) {
    return false;
  }
};