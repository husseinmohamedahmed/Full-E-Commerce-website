const customError = require("../utils/customer-error.js");
const asynchandler = require("express-async-handler");
const User = require("../models/User-Model");
const nodemailer = require("nodemailer")
exports.sendEmail=async(options)=>{
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT),
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const message={
    from:"E-shop app  <husseinsaeed052006@gmail.com>",
    to:options.email,
    subject:options.subject,
    text:options.message
}

await transporter.sendMail(message);
}