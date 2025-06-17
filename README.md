# 💰 Expense Tracker - Full Stack Application

A modern, full-stack expense tracking application built with React, Node.js, and MongoDB. Features Google OAuth authentication, real-time data visualization, and comprehensive financial management tools.

This project helps you manage your income and expenses more easily.

## ✨ Features

### 🔐 Authentication
- **Google OAuth 2.0** integration
- **Traditional email/password** login and registration
- **JWT token-based** authentication
- **Protected routes** and user-specific data

### 📊 Financial Management
- **Income tracking** with multiple categories
- **Expense tracking** with detailed categorization
- **Real-time balance** calculations
- **Interactive charts** and data visualization
- **Transaction history** with search and filtering

### 🎨 Modern UI/UX
- **Responsive design** for all devices
- **Professional dashboard** with financial insights
- **User profile** with achievements system
- **Clean, modern interface** with smooth animations

### 📈 Analytics & Insights
- **Savings rate** calculations
- **Financial trends** visualization
- **Min/max transaction** analysis
- **Monthly summaries** and statistics

## 🚀 Tech Stack

### Frontend
- **React 18** with Hooks
- **Styled Components** for styling
- **Chart.js** for data visualization
- **Google OAuth** for authentication
- **Axios** for API calls
- **React DatePicker** for date selection

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Auth Library** for OAuth verification
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Database
- **MongoDB Atlas** (cloud database)
- **User-specific data** isolation
- **Optimized queries** and indexing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/expense-tracker-fullstack.git
cd expense-tracker-fullstack
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

Create `.env` file in backend directory:
\`\`\`env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
\`\`\`

Start backend server:
\`\`\`bash
npm start
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

### 4. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Set up database user and network access
4. Get connection string and add to `.env`

## 📱 Usage

### Getting Started
1. **Register** with email/password or **sign in with Google**
2. **Add income** transactions with categories and descriptions
3. **Track expenses** across different categories
4. **View dashboard** for financial insights and charts
5. **Manage transactions** with search, filter, and delete options

### Features Overview
- **Dashboard**: Financial overview with charts and statistics
- **Incomes**: Add and manage income transactions
- **Expenses**: Track and categorize expenses
- **Transactions**: View all transactions with advanced filtering
- **Profile**: User account management and achievements

## 🎯 Key Features Explained

### User Authentication
- Secure login with Google OAuth 2.0
- Traditional registration with encrypted passwords
- JWT-based session management
- User-specific data isolation

### Financial Tracking
- Comprehensive income and expense categorization
- Real-time balance calculations
- Interactive data visualization
- Historical transaction management

### Data Visualization
- Income vs Expenses charts
- Savings rate calculations
- Financial trend analysis
- Achievement system for user engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Google OAuth for authentication
- Chart.js for data visualization
- MongoDB Atlas for database hosting
- React community for excellent documentation
