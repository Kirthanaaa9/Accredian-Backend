require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Submit Referral API
app.post("/api/referral", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All fields except message are required!" });
  }

  try {
    const referral = await prisma.referral.create({
      data: { name, email, phone, message },
    });

    // Send email notification
    await sendReferralEmail(email, name);

    res.status(201).json({ message: "Referral submitted successfully", referral });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Failed to submit referral" });
  }
});

// Send Referral Email
async function sendReferralEmail(email, name) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Referral Confirmation",
      text: `Hello ${name},\n\nThank you for your referral! We appreciate your effort.\n\nBest Regards, Team`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
