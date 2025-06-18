const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Expense Tracker Frontend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        console.log('📋 Creating .env file from template...');
        const envContent = fs.readFileSync(envExamplePath, 'utf8');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created!\n');
    } else {
        console.log('❌ .env.example file not found!\n');
    }
} else {
    console.log('⚠️  .env file already exists.\n');
}

console.log('📋 Next steps:');
console.log('1. Edit .env file and add your Google Client ID');
console.log('2. Make sure backend is running');
console.log('3. Run: npm start');
console.log('4. Check README.md for detailed setup instructions\n');

console.log('🔗 Get Google Client ID from:');
console.log('   https://console.cloud.google.com/\n');