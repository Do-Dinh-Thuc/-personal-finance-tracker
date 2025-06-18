require('dotenv').config();

console.log('🔍 Environment Variables Check\n');

const requiredVars = [
    { name: 'PORT', value: process.env.PORT },
    { name: 'MONGO_URL', value: process.env.MONGO_URL },
    { name: 'JWT_SECRET', value: process.env.JWT_SECRET },
    { name: 'GOOGLE_CLIENT_ID', value: process.env.GOOGLE_CLIENT_ID },
    { name: 'GOOGLE_CLIENT_SECRET', value: process.env.GOOGLE_CLIENT_SECRET },
    { name: 'FRONTEND_URL', value: process.env.FRONTEND_URL }
];

const optionalVars = [
    { name: 'EMAIL_HOST', value: process.env.EMAIL_HOST },
    { name: 'EMAIL_PORT', value: process.env.EMAIL_PORT },
    { name: 'EMAIL_USER', value: process.env.EMAIL_USER },
    { name: 'EMAIL_PASS', value: process.env.EMAIL_PASS }
];

console.log('✅ Required Variables:');
requiredVars.forEach(({ name, value }) => {
    const status = value ? '✅' : '❌';
    const displayValue = value ? (name.includes('SECRET') || name.includes('PASS') ? '***HIDDEN***' : value) : 'NOT SET';
    console.log(`${status} ${name}: ${displayValue}`);
});

console.log('\n🔧 Optional Variables (for email features):');
optionalVars.forEach(({ name, value }) => {
    const status = value ? '✅' : '⚠️ ';
    const displayValue = value ? (name.includes('PASS') ? '***HIDDEN***' : value) : 'NOT SET';
    console.log(`${status} ${name}: ${displayValue}`);
});

const missingRequired = requiredVars.filter(({ value }) => !value);
if (missingRequired.length > 0) {
    console.log('\n❌ Missing required variables. App will not work properly.');
    console.log('📋 Run: npm run setup');
} else {
    console.log('\n🎉 All required environment variables are set!');
}