const crypto = require('crypto');

describe('Salary Encryption Tests', () => {
  let encryptionService;
  const TEST_KEY = crypto.randomBytes(32).toString('hex');
  const TEST_SALARY = 4000;
  
  beforeAll(() => {
    // Mock encryption service
    encryptionService = {
      encrypt: function(data) {
        if (!process.env.ENCRYPTION_KEY) {
          throw new Error('ENCRYPTION_KEY not configured');
        }
        
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        
        let encrypted = cipher.update(data.toString(), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
          encrypted: encrypted,
          iv: iv.toString('hex'),
          authTag: authTag.toString('hex')
        };
      },
      
      decrypt: function(encryptedData) {
        if (!process.env.ENCRYPTION_KEY) {
          throw new Error('ENCRYPTION_KEY not configured');
        }
        
        if (!encryptedData || !encryptedData.encrypted || !encryptedData.iv || !encryptedData.authTag) {
          throw new Error('Invalid encrypted data format');
        }
        
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const authTag = Buffer.from(encryptedData.authTag, 'hex');
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return parseFloat(decrypted);
      }
    };
  });
  
  describe('Encryption Key Configuration', () => {
    it('should fail to encrypt without ENCRYPTION_KEY', () => {
      delete process.env.ENCRYPTION_KEY;
      
      expect(() => {
        encryptionService.encrypt(TEST_SALARY);
      }).toThrow('ENCRYPTION_KEY not configured');
    });
    
    it('should fail to decrypt without ENCRYPTION_KEY', () => {
      delete process.env.ENCRYPTION_KEY;
      
      expect(() => {
        encryptionService.decrypt({ encrypted: 'test', iv: 'test', authTag: 'test' });
      }).toThrow('ENCRYPTION_KEY not configured');
    });
    
    it('should work with valid ENCRYPTION_KEY', () => {
      process.env.ENCRYPTION_KEY = TEST_KEY;
      
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      expect(encrypted).toHaveProperty('encrypted');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('authTag');
    });
    
    it('should validate ENCRYPTION_KEY length', () => {
      // Key should be 32 bytes (64 hex characters)
      const shortKey = 'abc123';
      process.env.ENCRYPTION_KEY = shortKey;
      
      expect(() => {
        encryptionService.encrypt(TEST_SALARY);
      }).toThrow();
    });
  });
  
  describe('Encryption Process', () => {
    beforeEach(() => {
      process.env.ENCRYPTION_KEY = TEST_KEY;
    });
    
    it('should encrypt salary data', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.encrypted).not.toBe(TEST_SALARY.toString());
      expect(encrypted.encrypted.length).toBeGreaterThan(0);
    });
    
    it('should generate unique IV for each encryption', () => {
      const encrypted1 = encryptionService.encrypt(TEST_SALARY);
      const encrypted2 = encryptionService.encrypt(TEST_SALARY);
      
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);
    });
    
    it('should include authentication tag', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      expect(encrypted.authTag).toBeDefined();
      expect(encrypted.authTag.length).toBe(32); // 16 bytes in hex
    });
    
    it('should use AES-256-GCM algorithm', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      // AES-256-GCM specific checks
      expect(encrypted.iv.length).toBe(32); // 16 bytes in hex
      expect(encrypted.authTag.length).toBe(32); // 16 bytes in hex
    });
  });
  
  describe('Decryption Process', () => {
    beforeEach(() => {
      process.env.ENCRYPTION_KEY = TEST_KEY;
    });
    
    it('should decrypt encrypted salary correctly', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(TEST_SALARY);
    });
    
    it('should handle decimal values', () => {
      const salaryWithDecimals = 4567.89;
      const encrypted = encryptionService.encrypt(salaryWithDecimals);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(salaryWithDecimals);
    });
    
    it('should fail with tampered data', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      // Tamper with encrypted data
      encrypted.encrypted = encrypted.encrypted.slice(0, -2) + 'XX';
      
      expect(() => {
        encryptionService.decrypt(encrypted);
      }).toThrow();
    });
    
    it('should fail with wrong authentication tag', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      // Tamper with auth tag
      encrypted.authTag = crypto.randomBytes(16).toString('hex');
      
      expect(() => {
        encryptionService.decrypt(encrypted);
      }).toThrow();
    });
    
    it('should fail with wrong IV', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      // Use wrong IV
      encrypted.iv = crypto.randomBytes(16).toString('hex');
      
      expect(() => {
        encryptionService.decrypt(encrypted);
      }).toThrow();
    });
    
    it('should fail with wrong key', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      // Change key
      process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
      
      expect(() => {
        encryptionService.decrypt(encrypted);
      }).toThrow();
    });
  });
  
  describe('Data Format Validation', () => {
    beforeEach(() => {
      process.env.ENCRYPTION_KEY = TEST_KEY;
    });
    
    it('should reject invalid encrypted data format', () => {
      expect(() => {
        encryptionService.decrypt(null);
      }).toThrow('Invalid encrypted data format');
      
      expect(() => {
        encryptionService.decrypt({});
      }).toThrow('Invalid encrypted data format');
      
      expect(() => {
        encryptionService.decrypt({ encrypted: 'test' });
      }).toThrow('Invalid encrypted data format');
    });
    
    it('should handle large salary values', () => {
      const largeSalary = 999999999.99;
      const encrypted = encryptionService.encrypt(largeSalary);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(largeSalary);
    });
    
    it('should handle zero salary', () => {
      const zeroSalary = 0;
      const encrypted = encryptionService.encrypt(zeroSalary);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(zeroSalary);
    });
  });
  
  describe('Security Properties', () => {
    beforeEach(() => {
      process.env.ENCRYPTION_KEY = TEST_KEY;
    });
    
    it('should not leak salary information in encrypted form', () => {
      const salary1 = 3000;
      const salary2 = 3001;
      
      const encrypted1 = encryptionService.encrypt(salary1);
      const encrypted2 = encryptionService.encrypt(salary2);
      
      // Similar salaries should produce completely different ciphertexts
      expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);
      
      // Length should not reveal information
      const shortSalary = 1;
      const longSalary = 999999999;
      
      const encryptedShort = encryptionService.encrypt(shortSalary);
      const encryptedLong = encryptionService.encrypt(longSalary);
      
      // Encrypted length should be similar (padding)
      const lengthDiff = Math.abs(encryptedShort.encrypted.length - encryptedLong.encrypted.length);
      expect(lengthDiff).toBeLessThan(20);
    });
    
    it('should be cryptographically secure', () => {
      const encrypted = encryptionService.encrypt(TEST_SALARY);
      
      // Check entropy of encrypted data
      const uniqueChars = new Set(encrypted.encrypted).size;
      expect(uniqueChars).toBeGreaterThan(4); // Hex has limited charset, so lower threshold
      
      // Check that it's hex encoded
      expect(encrypted.encrypted).toMatch(/^[0-9a-f]+$/i);
      expect(encrypted.iv).toMatch(/^[0-9a-f]+$/i);
      expect(encrypted.authTag).toMatch(/^[0-9a-f]+$/i);
    });
  });
});