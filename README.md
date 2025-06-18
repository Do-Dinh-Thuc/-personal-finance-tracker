💰 Expense Tracker - Full Stack MERN Application
A comprehensive personal finance management application built with React, Node.js, Express, and MongoDB. Track your income and expenses with beautiful charts, Google authentication, and powerful analytics.
✨ Features
🔐 Multi-Authentication System

Google OAuth 2.0 - Seamless sign-in with Google account
Traditional Auth - Email/password registration and login
Password Recovery - Secure email-based password reset
JWT Security - Protected routes and secure sessions

💸 Financial Management

Income Tracking - Record multiple income sources with categories
Expense Management - Track expenses across various categories
Transaction History - Complete CRUD operations with filtering
Balance Calculation - Real-time balance and savings rate tracking

📊 Data Visualization & Analytics

Interactive Dashboard - Visual overview of financial health
Chart.js Integration - Beautiful line charts for income/expense trends
Financial Insights - Average amounts, highest/lowest transactions
Savings Analytics - Savings rate calculation and progress tracking

👤 User Experience

Profile Management - Edit profile information and upload pictures
Settings Panel - Notification preferences and security settings
Data Export - Download financial data in CSV or JSON format
Achievement System - Gamification with financial milestones
Responsive Design - Mobile-friendly interface

🎯 Advanced Features

Transaction Filtering - Search and filter by date, amount, category
Category Management - Predefined categories for income and expenses
Recent Activity - Quick view of latest transactions
Financial Goals - Emergency fund and savings rate tracking

🛠️ Tech Stack
Frontend

React 18 - Modern React with hooks and functional components
Styled Components - CSS-in-JS styling with theme support
Chart.js - Data visualization and interactive charts
Axios - HTTP client for API communication
React DatePicker - User-friendly date selection
Google OAuth - Authentication integration
Font Awesome - Icon library for UI elements

Backend

Node.js - Server-side JavaScript runtime
Express.js - Web application framework
MongoDB Atlas - Cloud-based NoSQL database
Mongoose - MongoDB object modeling
JWT - JSON Web Token authentication
bcrypt - Password hashing and security
Nodemailer - Email service for password reset
Google Auth Library - Server-side OAuth verification

Development Tools

Nodemon - Development server auto-restart
CORS - Cross-origin resource sharing
dotenv - Environment variable management
Moment.js - Date formatting and manipulation

🚀 Quick Start Guide
Prerequisites

Node.js (v16 or higher) → Download
MongoDB Atlas Account → Sign up
Google Cloud Account → Console
Gmail Account (for email features)

📦 Installation
1. Clone Repository
bashgit clone https://github.com/yourusername/expense-tracker-fullstack.git
cd expense-tracker-fullstack
2. Backend Setup
bashcd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials (see configuration section)

# Start backend server
npm run dev
3. Frontend Setup
bashcd ../frontend
npm install

# Create environment file
cp .env.example .env
# Add your Google Client ID

# Start frontend application
npm start
4. Access Application

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api/v1
API Health: http://localhost:5000/health

⚙️ Configuration Guide
MongoDB Atlas Setup

Create account at MongoDB Atlas
Create new project and cluster (free tier available)
Create database user with read/write permissions
Whitelist IP addresses (0.0.0.0/0 for development)
Get connection string and add to backend/.env

Google OAuth Configuration

Go to Google Cloud Console
Create new project or select existing
Enable Google+ API
Create OAuth 2.0 Client ID:

Application type: Web application
Authorized origins: http://localhost:3000
Authorized redirect URIs: http://localhost:3000


Copy Client ID and Secret to environment files

Email Service Setup (Optional)

Enable 2-Factor Authentication on Gmail
Generate App Password: Google Account Security
Add email credentials to backend/.env
📊 API Documentation
Authentication Endpoints
httpPOST /api/v1/auth/register     # Register new user
POST /api/v1/auth/login        # Traditional login
POST /api/v1/auth/google-auth  # Google OAuth login
GET  /api/v1/auth/me          # Get current user
POST /api/v1/auth/logout      # Logout user
POST /api/v1/auth/forgot-password   # Request password reset
POST /api/v1/auth/reset-password    # Reset password
PUT  /api/v1/auth/profile          # Update profile
Transaction Endpoints
http# Income Management
POST   /api/v1/add-income      # Add new income
GET    /api/v1/get-incomes     # Get user incomes
DELETE /api/v1/delete-income/:id  # Delete income

# Expense Management
POST   /api/v1/add-expense     # Add new expense
GET    /api/v1/get-expenses    # Get user expenses
DELETE /api/v1/delete-expense/:id # Delete expense
Request/Response Examples
Add Income
jsonPOST /api/v1/add-income
{
  "title": "Salary",
  "amount": 5000,
  "category": "salary",
  "description": "Monthly salary",
  "date": "2024-01-15"
}
Get Incomes Response
json[
  {
    "_id": "60f7b1b3b3b3b3b3b3b3b3b3",
    "title": "Salary",
    "amount": 5000,
    "category": "salary",
    "description": "Monthly salary",
    "date": "2024-01-15T00:00:00.000Z",
    "type": "income",
    "userId": "60f7b1b3b3b3b3b3b3b3b3b2",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
🎨 User Interface
Dashboard Features

Financial Overview Cards - Balance, income, expenses, savings rate
Interactive Charts - Visual representation of financial trends
Recent Activity - Last 3 transactions with quick overview
Quick Insights - Average amounts, highest/lowest transactions
Financial Goals - Progress tracking for savings and milestones

Profile Management

Edit Profile - Update name, email, profile picture
Settings Panel - Notification preferences and security options
Data Export - Download financial data in multiple formats
Achievement System - Unlock badges for financial milestones

Transaction Management

Add Transactions - User-friendly forms for income and expenses
Transaction History - Complete list with search and filter options
Categories - Predefined categories for better organization
CRUD Operations - Create, read, update, delete functionality

🔒 Security Features
Authentication Security

JWT Tokens - Secure session management
Password Hashing - bcrypt with salt rounds
Google OAuth - Industry-standard authentication
Protected Routes - Middleware-based route protection

Data Security

Input Validation - Server-side validation for all inputs
SQL Injection Prevention - Mongoose ODM protection
CORS Configuration - Proper cross-origin setup
Environment Variables - Sensitive data protection

User Privacy

Data Isolation - User-specific data access only
Secure Password Reset - Time-limited reset tokens
Profile Privacy - Personal information protection

🚀 Deployment Guide
Backend Deployment (Railway/Render/Heroku)

Create Account on deployment platform
Connect Repository to your GitHub repo
Set Environment Variables in platform dashboard
Configure Build Settings:

Build Command: npm install
Start Command: npm start
Root Directory: backend


Deploy and get production URL

Frontend Deployment (Vercel/Netlify)

Create Account on deployment platform
Connect Repository to your GitHub repo
Configure Build Settings:

Build Command: npm run build
Publish Directory: build
Root Directory: frontend


Set Environment Variables:

REACT_APP_API_URL: Your production backend URL
REACT_APP_GOOGLE_CLIENT_ID: Your Google Client ID


Deploy and get production URL

Production Configuration
Update Google OAuth

Add production URLs to authorized origins
Update redirect URIs for production domain

Database Security

Configure MongoDB Atlas IP whitelist for production
Use strong database passwords
Enable MongoDB Atlas backup

Environment Security

Use strong JWT secrets (64+ characters)
Rotate secrets regularly
Use platform environment variable managers
Manual Testing Checklist
Authentication Flow

 User registration with email/password
 User login with email/password
 Google OAuth login flow
 Password reset functionality
 Profile update features
 Logout functionality

Financial Operations

 Add income transactions
 Add expense transactions
 View transaction history
 Edit transactions
 Delete transactions
 Balance calculations

User Interface

 Dashboard data display
 Chart rendering
 Mobile responsiveness
 Profile modal functionality
 Settings panel operations
 Data export features

API Testing
Use tools like Postman or curl to test API endpoints:
bash# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Add income (with JWT token)
curl -X POST http://localhost:5000/api/v1/add-income \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Salary","amount":5000,"category":"salary","description":"Monthly salary","date":"2024-01-15"}'
🛠️ Development
Development Commands
Backend
bashnpm run dev      # Start development server with nodemon
npm start        # Start production server
npm run setup    # Create .env file and generate JWT secret
Frontend
bashnpm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
Code Style Guidelines
JavaScript/React

Use functional components with hooks
Follow ESLint and Prettier configurations
Use meaningful variable and function names
Comment complex business logic

Styling

Use styled-components for component styling
Follow mobile-first responsive design
Maintain consistent spacing and colors
Use CSS variables for theme values

Git Workflow

Use feature branches for new functionality
Write descriptive commit messages
Pull request reviews before merging
Keep commits atomic and focused

🐛 Troubleshooting
Common Issues
"MongoDB connection failed"
Solutions:

Verify connection string format in .env
Check IP whitelist in MongoDB Atlas (use 0.0.0.0/0 for development)
Ensure cluster is running and accessible
Verify username/password in connection string

"Google OAuth not working"
Solutions:

Verify Client ID matches in both frontend and backend
Check authorized origins in Google Cloud Console
Ensure OAuth consent screen is configured
Clear browser cache and cookies

"JWT token invalid"
Solutions:

Generate strong JWT secret (64+ characters)
Verify JWT_SECRET in backend .env
Clear localStorage in browser
Restart backend server after environment changes

"API connection failed"
Solutions:

Verify backend is running on correct port
Check REACT_APP_API_URL in frontend .env
Test API health endpoint: http://localhost:5000/health
Verify CORS configuration in backend

"Email not sending"
Solutions:

Use Gmail App Password, not regular password
Enable 2-Factor Authentication on Gmail account
Verify email credentials in backend .env
Test email configuration with provided test script

Debug Mode
Enable debug logging by setting environment variables:
bash# Backend debug
DEBUG=expense-tracker:* npm run dev

# Frontend debug
REACT_APP_DEBUG=true npm start

Made with ❤️ by Dinh Thuc 