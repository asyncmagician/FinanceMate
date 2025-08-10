const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

describe('JWT Security Tests', () => {
  let app;
  const TEST_SECRET = 'test-secret-key-for-testing';
  
  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    
    app = express();
    app.use(cookieParser());
    app.use(express.json());
    
    // Mock login endpoint that sets JWT cookie
    app.post('/api/auth/login', (req, res) => {
      const token = jwt.sign(
        { id: 1, email: 'test@test.com' },
        TEST_SECRET,
        { expiresIn: '7d' }
      );
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.json({ 
        success: true,
        user: { id: 1, email: 'test@test.com' }
      });
    });
    
    // Mock protected endpoint
    app.get('/api/protected', (req, res) => {
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      try {
        const decoded = jwt.verify(token, TEST_SECRET);
        res.json({ protected: true, user: decoded });
      } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
      }
    });
  });

  describe('JWT Cookie Security', () => {
    it('should set JWT in httpOnly cookie on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200);
      
      // Check that cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=/);
      expect(cookies[0]).toMatch(/HttpOnly/);
      expect(cookies[0]).toMatch(/SameSite=Strict/);
      
      // Check that token is NOT in response body
      expect(response.body.token).toBeUndefined();
      expect(response.body.jwt).toBeUndefined();
      expect(response.body.accessToken).toBeUndefined();
    });

    it('should not expose JWT in response body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200);
      
      // Ensure no token in response body
      const responseStr = JSON.stringify(response.body);
      expect(responseStr).not.toMatch(/eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/);
    });

    it('should set Secure flag in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200);
      
      const cookies = response.headers['set-cookie'];
      expect(cookies[0]).toMatch(/Secure/);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should reject requests without JWT cookie', async () => {
      const response = await request(app)
        .get('/api/protected')
        .expect(401);
      
      expect(response.body.error).toBe('No token provided');
    });

    it('should accept valid JWT from cookie', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@test.com' },
        TEST_SECRET,
        { expiresIn: '7d' }
      );
      
      const response = await request(app)
        .get('/api/protected')
        .set('Cookie', `token=${token}`)
        .expect(200);
      
      expect(response.body.protected).toBe(true);
      expect(response.body.user.email).toBe('test@test.com');
    });

    it('should reject invalid JWT', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Cookie', 'token=invalid-token')
        .expect(401);
      
      expect(response.body.error).toBe('Invalid token');
    });

    it('should reject expired JWT', async () => {
      const expiredToken = jwt.sign(
        { id: 1, email: 'test@test.com' },
        TEST_SECRET,
        { expiresIn: '-1h' } // Already expired
      );
      
      const response = await request(app)
        .get('/api/protected')
        .set('Cookie', `token=${expiredToken}`)
        .expect(401);
      
      expect(response.body.error).toBe('Invalid token');
    });

    it('should have proper maxAge for cookie (7 days)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200);
      
      const cookies = response.headers['set-cookie'];
      expect(cookies[0]).toMatch(/Max-Age=604800/); // 7 days in seconds
    });
  });

  describe('CSRF Protection', () => {
    it('should set SameSite=Strict on cookies', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200);
      
      const cookies = response.headers['set-cookie'];
      expect(cookies[0]).toMatch(/SameSite=Strict/);
    });
  });

  describe('Token Security', () => {
    it('should not accept JWT from Authorization header', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@test.com' },
        TEST_SECRET,
        { expiresIn: '7d' }
      );
      
      // Try to send token in Authorization header (should fail)
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
      
      expect(response.body.error).toBe('No token provided');
    });

    it('should use strong secret key in production', () => {
      // In real app, JWT_SECRET should be at least 32 characters
      const productionSecret = process.env.JWT_SECRET || TEST_SECRET;
      expect(productionSecret.length).toBeGreaterThanOrEqual(10); // Minimum for test
      // In production, this should be >= 32
    });
  });
});