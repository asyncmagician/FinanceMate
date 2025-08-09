# FinanceMate

A self-hosted personal finance tracker with Obsidian-style navigation, built for simplicity and privacy.

![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61dafb)

## Features

- **Obsidian-style Navigation**: Familiar year/month tree structure
- **Expense Tracking**: Fixed, variable, and reimbursement categories with subcategories
- **Smart Calculations**: Automatic pr�visionnel (forecast) calculations
- **Recurring Expenses**: Template system for monthly fixed costs
- **Dashboard & Analytics**: Visual spending overview with charts
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **French Localization**: Full french interface
- **Data Privacy**: Self-hosted solution: your data stays with you

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker 

### Development Setup

1. **Clone the repository**
```bash
git clone git@github.com:asyncmagician/FinanceMate.git
cd FinanceMate
```

2. **Start the database**
```bash
docker-compose up -d
```

3. **Setup backend**
```bash
cd backend
npm install
npm run db:init     
npm run db:migrate   
npm run dev          
```

4. **Setup frontend** 
```bash
cd frontend
npm install
npm run dev          
```

5. **Create the first (administrator) user**
```bash
cd backend
node scripts/createAdmin.js \
  --email ada@domain.tld \
  --first Ada \
  --last Lovelace \
  --role admin
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Environment Variables

Create `.env` files based on `.env.example`:

## Contributing

Contributions are always welcome! Feel free to submit a PR.

## License
This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a development setup guide. For production deployment, please refer to your preferred hosting solution's best practices for Node.js applications.