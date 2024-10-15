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

  // Email options for admin
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Ticket from ${userEmail}: ${subject}`,
    html: `<h1>New Ticket Submitted</h1>
           <p><strong>User Email:</strong> ${userEmail}</p>
           <p><strong>Message:</strong><br>${message}</p>`,
  };

  // Email options for the user
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Copy of Your Ticket: ${subject}`,
    html: `<h1>Your Ticket Has Been Submitted</h1>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Message:</strong><br>${message}</p>
           <p>We will get back to you shortly.</p>`,
  };

  try {
    // Send email to the admin
    await transporter.sendMail(adminMailOptions);
    console.log(`Admin Email sent to: ${process.env.ADMIN_EMAIL}`);

    // Send copy to the user
    await transporter.sendMail(userMailOptions);
    console.log(`User Email sent to: ${userEmail}`);

    res.status(200).json({ message: 'Ticket submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting ticket.' });
  }
});

// // Uncomment to start the server locally
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// Use this when hosting on Vercel
module.exports = app; // Export the app instead of starting the server
