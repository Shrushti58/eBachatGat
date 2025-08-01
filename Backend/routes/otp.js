const express = require('express');
const router = express.Router();
const Otp = require('../models/otpModel');
const sendOtpMail = require('../utils/sendOTP');
const crypto = require('crypto');


router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = crypto.randomInt(100000, 999999).toString();

  // Delete old OTPs for this email
  await Otp.deleteMany({ email });

  // Set OTP expiry time to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const newOtp = new Otp({ email, otp, expiresAt });

  try {
    await newOtp.save();
    await sendOtpMail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await Otp.findOne({ email });

    if (!record) return res.status(400).json({ message: 'OTP not found or expired.' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired.' });

    await Otp.deleteOne({ email });
    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal error verifying OTP.' });
  }
});


module.exports = router;
