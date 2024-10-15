const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/submit-ticket', async (req, res) => {
  const { userEmail, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Ticket from ${userEmail}: ${subject}`,
    html: `<h1>New Ticket Submitted</h1>
           <p><strong>User Email:</strong> ${userEmail}</p>
           <p><strong>Message:</strong><br>${message}</p>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    res.status(200).json({ message: 'Ticket submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting ticket.' });
  }
});

// Export the app for Vercel
module.exports = app;
