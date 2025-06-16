const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send reset password email
const sendResetPasswordEmail = async (email, resetToken, userName) => {
    try {
        const transporter = createTransporter();
        
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your Password - Expense Tracker',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🔒 Password Reset</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2>Hello ${userName}!</h2>
                        
                        <p>We received a request to reset your password for your Expense Tracker account.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 15px 30px; 
                                      text-decoration: none; 
                                      border-radius: 25px; 
                                      font-weight: bold;
                                      display: inline-block;">
                                Reset My Password
                            </a>
                        </div>
                        
                        <p><strong>This link will expire in 1 hour.</strong></p>
                        
                        <p>If you didn't request this password reset, please ignore this email. Your account is safe.</p>
                        
                        <hr style="margin: 30px 0; border: 1px solid #ddd;">
                        
                        <p style="font-size: 12px; color: #666;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${resetUrl}">${resetUrl}</a>
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Reset password email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending reset password email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendResetPasswordEmail,
};