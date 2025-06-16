require('dotenv').config();

const config = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/expense-tracker',
    
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || (() => {
        console.warn('⚠️  WARNING: Using default JWT secret. Set JWT_SECRET in .env file!');
        return 'default_jwt_secret_change_this_in_production';
    })(),
    
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || (() => {
        console.warn('⚠️  WARNING: Google Client ID not set. Set GOOGLE_CLIENT_ID in .env file!');
        return '';
    })(),
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || (() => {
        console.warn('⚠️  WARNING: Google Client Secret not set. Set GOOGLE_CLIENT_SECRET in .env file!');
        return '';
    })(),
    
    // Email Configuration
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    
    // Frontend URL
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    
    // Validation function
    validate() {
        const required = ['MONGO_URL', 'JWT_SECRET'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            console.error('❌ Missing required environment variables:', missing.join(', '));
            console.error('💡 Copy .env.example to .env and fill in the values');
            return false;
        }
        
        console.log('✅ Environment configuration loaded successfully');
        return true;
    }
};

module.exports = config;