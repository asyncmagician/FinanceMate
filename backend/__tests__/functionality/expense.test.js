const request = require('supertest');
const express = require('express');

describe('Expense Functionality Tests', () => {
  let app;
  let expenses = [];
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock auth middleware
    app.use((req, res, next) => {
      req.user = { id: 1, email: 'test@test.com' };
      next();
    });
    
    // Mock expense creation
    app.post('/api/expenses', (req, res) => {
      const { description, amount, category_id, subcategory, share_type, share_value, share_with } = req.body;
      
      // Validation
      if (!description || !amount || !category_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be positive' });
      }
      
      // If shared, partner name is required
      if (share_type && share_type !== 'none' && !share_with) {
        return res.status(400).json({ error: 'Partner name required for shared expenses' });
      }
      
      const expense = {
        id: expenses.length + 1,
        user_id: req.user.id,
        description,
        amount: parseFloat(amount),
        category_id,
        subcategory,
        share_type: share_type || 'none',
        share_value: share_value || null,
        share_with: share_with || null,
        created_at: new Date()
      };
      
      expenses.push(expense);
      
      // If shared expense, create reimbursement
      if (share_type && share_type !== 'none') {
        let reimbursementAmount = 0;
        
        if (share_type === 'equal') {
          reimbursementAmount = amount / 2;
        } else if (share_type === 'percentage') {
          reimbursementAmount = amount * ((100 - share_value) / 100);
        } else if (share_type === 'amount') {
          reimbursementAmount = amount - share_value;
        }
        
        const reimbursement = {
          id: expenses.length + 1,
          user_id: req.user.id,
          description: `Remboursement: ${description} (${share_with})`,
          amount: reimbursementAmount,
          category_id: 3, // Reimbursement category
          is_reimbursement: true,
          related_expense_id: expense.id,
          created_at: new Date()
        };
        
        expenses.push(reimbursement);
        
        res.json({ expense, reimbursement });
      } else {
        res.json({ expense });
      }
    });
    
    // Mock get expenses
    app.get('/api/expenses', (req, res) => {
      res.json({ expenses });
    });
    
    // Mock delete expense
    app.delete('/api/expenses/:id', (req, res) => {
      const id = parseInt(req.params.id);
      const index = expenses.findIndex(e => e.id === id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      expenses.splice(index, 1);
      res.json({ success: true });
    });
  });
  
  beforeEach(() => {
    expenses = [];
  });
  
  describe('Expense Creation', () => {
    it('should create a fixed expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Rent',
          amount: 1000,
          category_id: 1,
          subcategory: 'Logement'
        })
        .expect(200);
      
      expect(response.body.expense).toBeDefined();
      expect(response.body.expense.description).toBe('Rent');
      expect(response.body.expense.amount).toBe(1000);
      expect(response.body.expense.category_id).toBe(1);
    });
    
    it('should create a variable expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Groceries',
          amount: 150.50,
          category_id: 2,
          subcategory: 'Alimentation'
        })
        .expect(200);
      
      expect(response.body.expense.amount).toBe(150.50);
      expect(response.body.expense.category_id).toBe(2);
    });
    
    it('should create a reimbursement', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Refund from friend',
          amount: 50,
          category_id: 3
        })
        .expect(200);
      
      expect(response.body.expense.category_id).toBe(3);
    });
    
    it('should reject negative amounts', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Test',
          amount: -100,
          category_id: 1
        })
        .expect(400);
      
      expect(response.body.error).toBe('Amount must be positive');
    });
    
    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Test'
        })
        .expect(400);
      
      expect(response.body.error).toBe('Missing required fields');
    });
  });
  
  describe('Shared Expenses', () => {
    it('should create 50/50 shared expense with reimbursement', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Shared dinner',
          amount: 100,
          category_id: 2,
          share_type: 'equal',
          share_with: 'Partner'
        })
        .expect(200);
      
      expect(response.body.expense).toBeDefined();
      expect(response.body.reimbursement).toBeDefined();
      expect(response.body.reimbursement.amount).toBe(50);
      expect(response.body.reimbursement.description).toContain('Partner');
    });
    
    it('should create percentage shared expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Utilities',
          amount: 200,
          category_id: 1,
          share_type: 'percentage',
          share_value: 30, // User pays 30%
          share_with: 'Roommate'
        })
        .expect(200);
      
      expect(response.body.reimbursement.amount).toBe(140); // Partner owes 70%
    });
    
    it('should create fixed amount shared expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Internet',
          amount: 60,
          category_id: 1,
          share_type: 'amount',
          share_value: 20, // User pays 20€
          share_with: 'Flatmate'
        })
        .expect(200);
      
      expect(response.body.reimbursement.amount).toBe(40); // Partner owes 40€
    });
    
    it('should require partner name for shared expenses', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Shared expense',
          amount: 100,
          category_id: 1,
          share_type: 'equal'
          // Missing share_with
        })
        .expect(400);
      
      expect(response.body.error).toBe('Partner name required for shared expenses');
    });
  });
  
  describe('Expense Management', () => {
    it('should retrieve all expenses', async () => {
      // Create some expenses
      await request(app)
        .post('/api/expenses')
        .send({
          description: 'Expense 1',
          amount: 100,
          category_id: 1
        });
      
      await request(app)
        .post('/api/expenses')
        .send({
          description: 'Expense 2',
          amount: 200,
          category_id: 2
        });
      
      const response = await request(app)
        .get('/api/expenses')
        .expect(200);
      
      expect(response.body.expenses).toHaveLength(2);
      expect(response.body.expenses[0].description).toBe('Expense 1');
      expect(response.body.expenses[1].description).toBe('Expense 2');
    });
    
    it('should delete an expense', async () => {
      // Create an expense
      const createResponse = await request(app)
        .post('/api/expenses')
        .send({
          description: 'To delete',
          amount: 100,
          category_id: 1
        });
      
      const expenseId = createResponse.body.expense.id;
      
      // Delete it
      await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .expect(200);
      
      // Verify it's gone
      const getResponse = await request(app)
        .get('/api/expenses')
        .expect(200);
      
      expect(getResponse.body.expenses).toHaveLength(0);
    });
    
    it('should handle deleting non-existent expense', async () => {
      const response = await request(app)
        .delete('/api/expenses/999')
        .expect(404);
      
      expect(response.body.error).toBe('Expense not found');
    });
  });
  
  describe('Expense Categories', () => {
    it('should accept valid category IDs', async () => {
      const categories = [1, 2, 3]; // Fixed, Variable, Reimbursement
      
      for (const category_id of categories) {
        const response = await request(app)
          .post('/api/expenses')
          .send({
            description: `Category ${category_id} expense`,
            amount: 100,
            category_id
          })
          .expect(200);
        
        expect(response.body.expense.category_id).toBe(category_id);
      }
    });
    
    it('should handle subcategories', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Car payment',
          amount: 500,
          category_id: 1,
          subcategory: 'Voiture'
        })
        .expect(200);
      
      expect(response.body.expense.subcategory).toBe('Voiture');
    });
  });
  
  describe('Amount Handling', () => {
    it('should handle decimal amounts correctly', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'Precise amount',
          amount: 123.45,
          category_id: 2
        })
        .expect(200);
      
      expect(response.body.expense.amount).toBe(123.45);
    });
    
    it('should convert string amounts to numbers', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: 'String amount',
          amount: '250.50',
          category_id: 1
        })
        .expect(200);
      
      expect(response.body.expense.amount).toBe(250.50);
      expect(typeof response.body.expense.amount).toBe('number');
    });
  });
});