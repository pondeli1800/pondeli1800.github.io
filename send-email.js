import nodemailer from "nodemailer";

const data = JSON.parse(process.env.FORM_DATA);

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

await transporter.sendMail({
  from: `"Kontakt Form" <${process.env.SMTP_USER}>`,
  to: process.env.EMAIL_TO,
  replyTo: data.email,
  subject: "Nová zpráva z webu",
  text: `Email: ${data.email}\n\nZpráva:\n${data.message}`
});
