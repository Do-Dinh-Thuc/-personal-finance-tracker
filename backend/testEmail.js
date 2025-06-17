// Create a test file: testEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmailConfiguration = async () => {
    console.log('🧪 Testing email configuration...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔑 App Password exists:', !!process.env.EMAIL_PASS);
    console.log('🔑 App Password length:', process.env.EMAIL_PASS?.length);
    
    const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false, // false for 587, true for 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        debug: true, // Enable debug logs
    });

    try {
        // Test connection
        console.log('🔧 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!');

        // Send test email
        console.log('📤 Sending test email...');
        const info = await transporter.sendMail({
            from: `"Expense Tracker Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email - Password Reset Setup',
            text: 'If you receive this email, your password reset configuration is working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>🎉 Email Configuration Test</h2>
                    <p>Congratulations! Your email configuration is working correctly.</p>
                    <p>You can now use the password reset feature in your Expense Tracker application.</p>
                    <hr>
                    <small>This is an automated test email from your Expense Tracker application.</small>
                </div>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📬 Check your inbox for the test email');
        
        return true;
        
    } catch (error) {
        console.error('❌ Email configuration error:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Provide specific troubleshooting based on error
        if (error.code === 'EAUTH') {
            console.log('\n🔧 TROUBLESHOOTING:');
            console.log('- Make sure you generated a Gmail App Password (not regular password)');
            console.log('- The App Password should be 16 characters long');
            console.log('- 2-Factor Authentication must be enabled on your Gmail account');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🔧 TROUBLESHOOTING:');
            console.log('- Check your internet connection');
            console.log('- Your network might be blocking SMTP port 587');
            console.log('- Try from a different network or mobile hotspot');
        }
        
        return false;
    }
};

// Run the test
testEmailConfiguration()
    .then((success) => {
        if (success) {
            console.log('\n🎉 Email setup complete! Password reset should now work.');
        } else {
            console.log('\n❌ Email setup failed. Please fix the issues above.');
        }
        process.exit(0);
    })
    .catch((error) => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });