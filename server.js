const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path'); // Import path for serving static files
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory

// Configure the email transporter
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to submit a ticket
app.post('/submit-ticket', async (req, res) => {
  const { userEmail, subject, message } = req.body;

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Ticket from ${userEmail}: ${subject}`,
    html: `<h1>New Ticket Submitted</h1>
           <p><strong>User Email:</strong> ${userEmail}</p>
           <p><strong>Message:</strong><br>${message}</p>`,
  };

  try {
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    res.status(200).json({ message: 'Ticket submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting ticket.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
