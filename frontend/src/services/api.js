const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        this.setToken(null);
        window.location.href = '/login';
      }
      throw new Error('Identifiants invalides');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async getMonths() {
    return this.request('/months');
  }

  async getMonth(year, month) {
    return this.request(`/months/${year}/${month}`);
  }

  async createMonth(year, month, startingBalance) {
    return this.request('/months', {
      method: 'POST',
      body: JSON.stringify({ year, month, starting_balance: startingBalance }),
    });
  }

  async updateMonth(year, month, startingBalance) {
    return this.request(`/months/${year}/${month}`, {
      method: 'PUT',
      body: JSON.stringify({ starting_balance: startingBalance }),
    });
  }

  async getMonthExpenses(year, month) {
    return this.request(`/expenses/month/${year}/${month}`);
  }

  async createExpense(expense) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id, expense) {
    return this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getPrevisionnel(year, month) {
    return this.request(`/months/${year}/${month}/previsionnel`);
  }

  async getForecast(months) {
    return this.request(`/months/forecast/${months}`);
  }

  async getRecurringExpenses() {
    return this.request('/expenses/recurring');
  }

  async createRecurringExpense(expense) {
    return this.request('/expenses/recurring', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateRecurringExpense(id, expense) {
    return this.request(`/expenses/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteRecurringExpense(id) {
    return this.request(`/expenses/recurring/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();