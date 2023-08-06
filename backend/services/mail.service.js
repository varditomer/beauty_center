const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // Use 'apikey' as the username
    pass: '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'
  }
});

module.exports = transporter