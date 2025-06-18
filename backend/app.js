const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
        console.error(`   - ${envVar}`);
    });
    console.error('\n📋 Setup instructions:');
    console.error('1. Copy .env.example to .env');
    console.error('2. Fill in your actual credentials');
    console.error('3. See README.md for detailed setup guide\n');
    process.exit(1);
}

//middlewares
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))

// Add debug middleware
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Expense Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

//routes
readdirSync('./routes').map((route) => {
    console.log('📁 Loading route file:', route); // Debug
    return app.use('/api/v1', require('./routes/' + route))
})

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('🚀 Server listening on port:', PORT)
        console.log('🌐 Frontend URL:', process.env.FRONTEND_URL)
        console.log('🔑 JWT Secret configured:', !!process.env.JWT_SECRET)
        console.log('🔍 Google OAuth configured:', !!process.env.GOOGLE_CLIENT_ID)
        console.log('📧 Email configured:', !!process.env.EMAIL_USER)
        console.log('📊 API Health Check: http://localhost:' + PORT + '/health')
    })
}

server()