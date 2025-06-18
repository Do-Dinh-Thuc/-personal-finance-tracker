// Configuration file for frontend application
const config = {
    // API Base URL - defaults to localhost for development
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    
    // Google OAuth Client ID - must be configured
    GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    
    // App metadata
    APP_NAME: 'Expense Tracker',
    APP_VERSION: '1.0.0',
    
    // Development flag
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development'
};

// Validation for required config
if (!config.GOOGLE_CLIENT_ID && process.env.NODE_ENV !== 'development') {
    console.error('❌ REACT_APP_GOOGLE_CLIENT_ID is required!');
    console.error('📋 Please check your .env file and add your Google Client ID');
}

export default config;