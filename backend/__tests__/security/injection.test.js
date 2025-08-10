const request = require('supertest');
const express = require('express');
const mysql = require('mysql2/promise');

describe('SQL Injection & XSS Protection Tests', () => {
  let app;
  let mockDb;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock database connection
    mockDb = {
      execute: jest.fn().mockResolvedValue([[], []]),
      query: jest.fn().mockResolvedValue([[], []])
    };
    
    // Mock expense creation endpoint
    app.post('/api/expenses', async (req, res) => {
      const { description, amount, category_id } = req.body;
      
      // Input validation
      if (!description || !amount || !category_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Amount validation
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      
      // Category validation
      if (!Number.isInteger(category_id) || category_id < 1 || category_id > 3) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      
      // Sanitize description - remove any HTML/script tags
      const sanitizedDescription = description
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '');
      
      try {
        // Use parameterized query (safe from SQL injection)
        await mockDb.execute(
          'INSERT INTO expenses (description, amount, category_id) VALUES (?, ?, ?)',
          [sanitizedDescription, amount, category_id]
        );
        
        res.json({ 
          success: true, 
          expense: { 
            description: sanitizedDescription, 
            amount, 
            category_id 
          } 
        });
      } catch (error) {
        res.status(500).json({ error: 'Database error' });
      }
    });
    
    // Mock search endpoint
    app.get('/api/expenses/search', async (req, res) => {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query required' });
      }
      
      // Limit query length
      if (query.length > 100) {
        return res.status(400).json({ error: 'Query too long' });
      }
      
      // Use parameterized query with LIKE
      const searchPattern = `%${query}%`;
      
      try {
        await mockDb.execute(
          'SELECT * FROM expenses WHERE description LIKE ?',
          [searchPattern]
        );
        
        res.json({ results: [] });
      } catch (error) {
        res.status(500).json({ error: 'Database error' });
      }
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in description field', async () => {
      const maliciousInput = "'; DROP TABLE expenses; --";
      
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: maliciousInput,
          amount: 100,
          category_id: 1
        })
        .expect(200);
      
      // Check that the query used parameterized values
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO expenses'),
        expect.arrayContaining([expect.any(String), 100, 1])
      );
      
      // The malicious SQL should be treated as plain text
      const [[query, params]] = mockDb.execute.mock.calls;
      // The sanitized description removes script tags but keeps other text
      expect(query).not.toContain('DROP TABLE');
      expect(params[0]).toBe("'; DROP TABLE expenses; --");
    });

    it('should prevent SQL injection in numeric fields', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Test expense',
          amount: '100; DROP TABLE users;',
          category_id: 1
        })
        .expect(400);
      
      expect(response.body.error).toBe('Invalid amount');
    });

    it('should prevent SQL injection in search queries', async () => {
      const maliciousSearch = "' OR '1'='1";
      
      await request(app)
        .get('/api/expenses/search')
        .query({ query: maliciousSearch })
        .expect(200);
      
      // Check that parameterized query was used
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('WHERE description LIKE ?'),
        expect.arrayContaining([`%${maliciousSearch}%`])
      );
    });

    it('should never use string concatenation for queries', () => {
      // This is a meta-test to ensure we're using parameterized queries
      const mockCalls = mockDb.execute.mock.calls;
      
      mockCalls.forEach(([query]) => {
        // Query should have placeholders, not concatenated values
        expect(query).toMatch(/\?/);
        expect(query).not.toMatch(/\$\{/); // No template literals
        expect(query).not.toMatch(/\+/); // No string concatenation
      });
    });

    it('should validate category_id to prevent injection', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Test',
          amount: 100,
          category_id: '1 OR 1=1'
        })
        .expect(400);
      
      expect(response.body.error).toBe('Invalid category');
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize HTML tags in description', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: '<script>alert("XSS")</script>Normal text',
          amount: 100,
          category_id: 1
        })
        .expect(200);
      
      expect(response.body.expense.description).toBe('Normal text');
      expect(response.body.expense.description).not.toContain('<script>');
    });

    it('should remove multiple script tags', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: '<script>alert(1)</script>Text<script>alert(2)</script>',
          amount: 100,
          category_id: 1
        })
        .expect(200);
      
      expect(response.body.expense.description).toBe('Text');
    });

    it('should sanitize other HTML tags', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: '<div onclick="alert()">Click me</div>',
          amount: 100,
          category_id: 1
        })
        .expect(200);
      
      expect(response.body.expense.description).toBe('Click me');
    });

    it('should handle encoded XSS attempts', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: '&lt;script&gt;alert("XSS")&lt;/script&gt;',
          amount: 100,
          category_id: 1
        })
        .expect(200);
      
      // Encoded tags should be preserved as text
      expect(response.body.expense.description).not.toContain('<script>');
    });
  });

  describe('Input Length Validation', () => {
    it('should limit search query length', async () => {
      const longQuery = 'a'.repeat(101);
      
      const response = await request(app)
        .get('/api/expenses/search')
        .query({ query: longQuery })
        .expect(400);
      
      expect(response.body.error).toBe('Query too long');
    });

    it('should validate numeric inputs', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Test',
          amount: -100, // Negative amount
          category_id: 1
        })
        .expect(400);
      
      expect(response.body.error).toBe('Invalid amount');
    });

    it('should validate category range', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Test',
          amount: 100,
          category_id: 999 // Invalid category
        })
        .expect(400);
      
      expect(response.body.error).toBe('Invalid category');
    });
  });

  describe('Content Security', () => {
    it('should not reflect user input in errors', async () => {
      const maliciousInput = '<img src=x onerror=alert(1)>';
      
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: maliciousInput,
          amount: 'not-a-number',
          category_id: 1
        })
        .expect(400);
      
      // Error message should not contain the malicious input
      expect(response.body.error).toBe('Invalid amount');
      expect(response.body.error).not.toContain(maliciousInput);
    });
  });
});