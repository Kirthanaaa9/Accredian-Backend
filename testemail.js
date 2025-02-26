require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendTestEmail() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: "kirthanaaa9@gmail.com", // Test with your actual email
    subject: "Test Email",
    text: "This is a test email from Node.js",
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Test Email sent:", info.response);
  } catch (error) {
    console.error("Test Email sending failed:", error);
  }
}

sendTestEmail();
