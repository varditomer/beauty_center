const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER, // Use 'apikey' as the username
    pass: process.env.MAIL_PASSWORD
  }
});

module.exports = transporter