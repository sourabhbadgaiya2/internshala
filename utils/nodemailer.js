const nodemailer = require('nodemailer');
const ErrorHandler = require('./errorHandler');

exports.sendMail = (req, res, next, email, url) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.USERS_EMAIL,
      pass: process.env.USERS_EMAIL_PASSWORD,
    },
  });

  const mailoptions = {
    from: 'Sourabh Private Limited ',
    to: req.body.email,
    subject: 'Password Reset Link',
    // text: 'Do Not Share This Link TO any One',
    html: `<h1>Click link blow to reset password</h1>
    <a href="${url}">Password Reset Link</a>
    
    `,
  };

  transport.sendMail(mailoptions, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));

    console.log(info);

    return res.status(200).json({
      message: 'mail sent successfully',
      url,
    });
  });
};
