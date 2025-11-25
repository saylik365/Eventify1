const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendOtp = async (email, otp) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Eventify OTP Verification',
    text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRES_SECONDS || 60}s.`
  });
};
