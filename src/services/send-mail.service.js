const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAcknowledgement = (email) => {
  const msg = {
    to: email, // Change to your recipient
    from: "samipan.b@antino.io", // Change to your verified sender
    subject: "Acknowledgement",
    text: "Acknowledgement",
    html: "<strong>Email confirmed</strong>",
  };
  return sgMail.send(msg);
};

const sendUrlToAdmin = (email, url) => {
  const msg = {
    to: email,
    from: "samipan.b@antino.io",
    subject: "Uploaded successfully",
    text: "Download now",
    html: `<a href=${url}> Download excel sheet </a>`,
  };
  return sgMail.send(msg);
};

module.exports = { sendAcknowledgement, sendUrlToAdmin };
