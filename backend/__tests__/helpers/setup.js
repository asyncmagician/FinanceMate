require('dotenv').config();

// Override database to use test database
process.env.DB_NAME = process.env.DB_NAME + '_test';
process.env.NODE_ENV = 'test';

// Disable console.log during tests
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
}

module.exports = {};