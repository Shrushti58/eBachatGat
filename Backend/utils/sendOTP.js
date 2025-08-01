const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: `"e-Bachat Gat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your OTP for Secure Verification - e-Bachat Gat',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #2c3e50;">👋 Hello!</h2>
      
      <p>Thank you for being a part of <strong>e-Bachat Gat</strong>. To continue securely, please use the One-Time Password (OTP) below to verify your email:</p>
      
      <div style="font-size: 24px; font-weight: bold; color: #0066cc; background: #f0f8ff; padding: 10px 20px; display: inline-block; border-radius: 5px; margin: 10px 0;">
        ${otp}
      </div>
      
      <p>This OTP is valid for <strong>5 minutes</strong>. Please don’t share it with anyone to keep your account secure. 🔒</p>

      <p>If you didn’t request this, you can safely ignore this email.</p>
      
      <br/>
      <p style="font-size: 14px; color: #777;">Warm regards,<br/><strong>The e-Bachat Gat Team</strong></p>
    </div>
  `
  };


  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpMail;
