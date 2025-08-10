# FinanceMate

A self-hosted personal finance management application with Obsidian-style navigation, built for simplicity, privacy, and GDPR compliance.

![Version](https://img.shields.io/badge/version-1.0.0-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61dafb)
![Security](https://img.shields.io/badge/security-enhanced-green)
![GDPR](https://img.shields.io/badge/GDPR-compliant-blue)

## 🚀 Features

### Core Functionality
- **Obsidian-style Navigation**: Familiar year/month tree structure
- **Expense Management**: Fixed, variable, and reimbursement categories with custom subcategories
- **Smart Calculations**: Automatic prévisionnel (forecast) calculations
- **Recurring Expenses**: Template system for monthly fixed costs
- **Dashboard & Analytics**: Visual spending overview with interactive charts
- **Financial Forecasting**: 3/6/12 month projections based on spending patterns

### User Experience
- **Bilingual Support**: Full French and English interface
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Context-Aware Navigation**: Smart 404 pages and legal document navigation
- **Data Export**: Export your data in JSON or CSV format (GDPR Article 20)
- **Administration Panel**: User management for admin users (CRUD operations)

### Security & Privacy
- **Self-Hosted**: Your data stays on your infrastructure
- **GDPR Compliant**: Full compliance with EU privacy regulations
- **Enhanced Security**: Strong password policies, rate limiting, secure tokens
- **Age Verification**: 16+ requirement with consent management
- **Data Protection**: bcrypt password hashing, JWT authentication, encrypted connections
- **Encrypted Salary**: Optional AES-256-GCM encrypted salary storage (user-only access)

## 📋 Requirements

- Node.js 18+ and npm
- Docker and Docker Compose
- MariaDB 11 (via Docker)

## 🛠️ Installation

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/asyncmagician/FinanceMate.git
cd FinanceMate
```

2. **Configure environment**
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your secure values:
# - Generate JWT_SECRET: openssl rand -base64 32
# - Set strong DB_PASSWORD (16+ characters)
# - Generate ENCRYPTION_KEY: node scripts/generateEncryptionKey.js
```

3. **Start the database**
```bash
docker-compose up -d
```

4. **Setup backend**
```bash
cd backend
npm install
npm run db:init      # Initialize database schema
npm run db:migrate   # Run migrations
npm run dev          # Start development server
```

5. **Setup frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev          # Start development server
```

6. **Create admin user**
```bash
cd backend
node scripts/createAdmin.js \
  --email admin@example.com \
  --first John \
  --last Doe \
  --role admin
```

7. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## 🔒 Security Configuration

### Production Requirements

Before deploying to production, ensure:

1. **Strong Secrets**
   - JWT_SECRET: Minimum 32 characters (use `openssl rand -base64 32`)
   - DB_PASSWORD: Strong password with 16+ characters
   - ENCRYPTION_KEY: 64-character hex string (use `node scripts/generateEncryptionKey.js`)

2. **Database Security**
   - Port binding restricted to localhost (configured in docker-compose.yml)
   - Regular backups recommended

3. **Password Policy**
   - Minimum 8 characters
   - Must contain uppercase, lowercase, and numbers
   - Enforced on registration and password changes

4. **Rate Limiting**
   - Authentication: 5 attempts per 15 minutes
   - General API: 100 requests per 15 minutes

## 🌍 GDPR Compliance

FinanceMate is fully GDPR compliant with:

- **Article 7**: Granular consent mechanism
- **Article 8**: Age verification (16+ requirement)
- **Article 13**: Clear privacy policy and lawful basis
- **Article 17**: Right to erasure (account deletion)
- **Article 20**: Data portability (JSON/CSV export)
- **Article 32**: Security of processing

## 📱 Features Overview

### Dashboard
- Monthly spending overview
- Recent transactions
- Quick action buttons
- 3-month spending history chart
- Pending reimbursements tracker

### Expense Management
- Hierarchical categorization (Category > Subcategory)
- Custom subcategories support
- Deducted/Received status tracking
- Real-time prévisionnel updates

### Recurring Expenses
- Template management for fixed costs
- One-click monthly application
- Edit and delete capabilities
- Automatic duplicate prevention

### Financial Forecasting
- 3, 6, and 12-month projections
- Based on average spending patterns
- Interactive line charts
- Detailed monthly breakdowns

### User Profile
- Personal information management
- Encrypted salary storage (optional)
- Password change functionality
- Data export (JSON/CSV)
- Account deletion with full data erasure

### Administration (Admin Only)
- User management dashboard
- Create, read, update, delete users
- View last login timestamps
- Role management (admin/user)
- Security: Admins cannot access user financial data

## 🌐 Language Support

Currently supported languages:
- 🇫🇷 French (default)
- 🇬🇧 English

Language preference is saved per user and persists across sessions.

## 📊 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS v3
- React Router DOM
- Chart.js for visualizations
- Axios for API communication

### Backend
- Express.js
- MariaDB 11
- JWT authentication
- bcrypt for password hashing
- Express-validator for input validation
- Helmet.js for security headers

## ⚖️ GDPR Compliance Notice

If you deploy FinanceMate for yourself or others, you must update the `/frontend/src/config/app.config.js` file with your organization's information for GDPR compliance. This includes setting the data controller name and contact information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described
- Reset app.config.js to generic values before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/asyncmagician/FinanceMate)
- **Issues**: [Bug Reports](https://github.com/asyncmagician/FinanceMate/issues)
- **Author**: [Antony BARTOLOMUCCI](https://github.com/asyncmagician)

## 🙏 Acknowledgments

- Inspired by Obsidian's intuitive navigation system
- Built with privacy and user control as core principles
- Designed for the self-hosting community

---

**Version**: 1.0.0 Stable  
**Release Date**: August 2025  
**Status**: Production Ready

⚠️ **Note**: Always backup your data before updates. For production deployment, follow security best practices and keep your dependencies updated.