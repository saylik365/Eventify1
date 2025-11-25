const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../utils/sendOtp');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRES_SECONDS) * 1000));

  const user = await User.create({ name, email, password: hashed, otp, otpExpires });
  await sendOtp(email, otp);
  res.json({ message: 'OTP sent', email });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });
  if (user.isVerified) return res.json({ message: 'Already verified' });

  if (user.otp !== otp || Date.now() > user.otpExpires)
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: 'Verified successfully' });
};

// 📩 RESEND OTP for unverified users
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 60 * 1000); // 1 min expiry

    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send email again
    await sendOtp(user.email, newOtp);

    res.json({ message: "New OTP sent successfully", email: user.email });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
};
