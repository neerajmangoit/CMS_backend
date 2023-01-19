import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "raj.mangoit@gmail.com",
    pass: "mlstwpleevuzxluf",
  },
});

var sentDataEmail;

async function sendEmail(options) {

  await transporter.sendMail(options)
    .then((info) => {
      sentDataEmail = info.response;
    })
    .catch((error) => {
      sentDataEmail = 'error';
    });
  return sentDataEmail;
}

export default sendEmail;