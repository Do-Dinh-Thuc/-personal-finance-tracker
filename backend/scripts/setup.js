const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Expense Tracker Backend...\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('🔑 Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Check if .env exists
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        console.log('📋 Creating .env file from template...');
        let envContent = fs.readFileSync(envExamplePath, 'utf8');
        
        // Replace the JWT secret placeholder
        envContent = envContent.replace(
            'generate_a_super_secure_random_string_at_least_64_characters_long_using_command_above',
            jwtSecret
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created with generated JWT secret!\n');
    } else {
        console.log('❌ .env.example file not found!\n');
    }
} else {
    console.log('⚠️  .env file already exists.\n');
    console.log('🔑 If you need a new JWT secret, use this one:');
    console.log(`JWT_SECRET=${jwtSecret}\n`);
}

console.log('📋 Next steps:');
console.log('1. Edit .env file and add your actual credentials:');
console.log('   - MongoDB Atlas connection string');
console.log('   - Google OAuth Client ID and Secret');
console.log('   - Email credentials (optional)');
console.log('2. Run: npm run dev');
console.log('3. Check README.md for detailed setup instructions\n');

console.log('🔗 Useful links:');
console.log('• MongoDB Atlas: https://cloud.mongodb.com/');
console.log('• Google Cloud Console: https://console.cloud.google.com/');
console.log('• Gmail App Passwords: https://myaccount.google.com/apppasswords\n');