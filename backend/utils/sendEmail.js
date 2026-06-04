import transporter from "../config/nodemailer.js";

const sendEmail = async (
  to,
  subject,
  text,
  html
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Error sending email:", error.message || error);
  }
};

export default sendEmail;