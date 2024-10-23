const nodemailer = require("nodemailer");

const mailerContact = async (credential) => {
  const transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const message = {
    to: `"Mainul Hasan" ${process.env.EMAIL}`, // sender address
    from: `${credential.email}`,
    //   "bar@example.com, baz@example.com",
    // list of receivers
    subject: credential?.subject, // Subject line
    text: credential?.body,
    // plain text body
    html: `<b>${credential?.body}</b>`, // html body
  };
  let info = await transporter.sendMail(message);
};

module.exports = mailerContact;
