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
      // Don't logout for password change endpoint
      if (endpoint.includes('/change-password')) {
        const error = await response.json().catch(() => ({ error: 'Mot de passe actuel incorrect' }));
        throw new Error(error.error || 'Mot de passe actuel incorrect');
      }
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

  async register(email, password, firstName, lastName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    return data;
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

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteUserData() {
    return this.request('/user/data', {
      method: 'DELETE',
    });
  }

  async deleteAccount() {
    return this.request('/user/account', {
      method: 'DELETE',
    });
  }

  async getSalary() {
    return this.request('/user/salary');
  }

  async updateSalary(salary) {
    return this.request('/user/salary', {
      method: 'PUT',
      body: JSON.stringify({ salary }),
    });
  }

  async exportUserData(format = 'json') {
    return this.request(`/export/${format}`);
  }

  async exportUserDataCSV() {
    const url = `${API_BASE_URL}/export/csv`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.text();
  }

  // Admin methods
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();