const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

let configOptions = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "maryniak2104@meta.ua",
        pass: META_PASSWORD
    }
}

const transport = nodemailer.createTransport(configOptions);

const sendEmail = async (data) => {
  const email = { ...data, from: "maryniak2104@meta.ua" };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;