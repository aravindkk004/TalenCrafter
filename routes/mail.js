import express from "express";
import nodemailer from "nodemailer";
import env from "dotenv";
env.config();

const router = express.Router();

//feedback mail
router.post("/", (req, res) => {
  const { fName, email, description } = req.body;
  console.log(email);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL,
    subject: "Feedback from user",
    text: description,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("email send successfully...");
      res.redirect("/");
    }
  });
});

export default router;
