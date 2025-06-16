const config = {
    // API Configuration
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || (() => {
        console.warn('⚠️  WARNING: Google Client ID not set. Set REACT_APP_GOOGLE_CLIENT_ID in .env file!');
        return '767774719514-drp750klap3rsvub9ht01amikblv4kua.apps.googleusercontent.com'; // Fallback
    })(),
    
    // Feature Flags
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true',
    
    // Environment
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    
    // Validation function
    validate() {
        if (!this.GOOGLE_CLIENT_ID) {
            console.error('❌ Google Client ID is required for authentication');
            console.error('💡 Copy .env.example to .env and add REACT_APP_GOOGLE_CLIENT_ID');
            return false;
        }
        
        if (this.ENABLE_DEBUG) {
            console.log('🔧 Debug mode enabled');
            console.log('📡 API URL:', this.API_URL);
            console.log('🔑 Google Client ID:', this.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
        }
        
        return true;
    }
};

// Validate on import
config.validate();

export default config;