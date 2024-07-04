// const Mailjet = require("node-mailjet");
// const RequestError = require("./RequestError");
// require("dotenv").config();

// const { MAILJET_API_KEY, MAILJET_API_SECRET } = process.env;

// const mailJetMessage = async ({ to, subject, Vars, html }) => {
//   try {
//     const mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_API_SECRET);
//     const { response } = await mailjet.post("send", { version: "v3" }).request({
//       FromEmail: "vlad777.od@gmail.com",
//       FromName: "Slim-mom team",
//       Subject: subject,
//       Recipients: [
//         {
//           Email: to,
//         },
//       ],
//       "Html-part": html,
//       Vars,
//     });

//     return {
//       status: response?.status,
//       message: "Email sent successfully",
//     };
//   } catch (error) {
//     throw RequestError(
//       400,
//       error?.message || "Something went wrong. Failed to sent message"
//     );
//   }
// };

// module.exports = mailJetMessage;

const nodemailer = require("nodemailer");
require("dotenv/config");
const { MAILJET_API_KEY, MAILJET_API_SECRET } = process.env;
const nodemailerConfig = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAILJET_API_KEY,
    pass: MAILJET_API_SECRET,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);
const mailJetMessage = async (data) => {
  const email = { ...data, from: MAILJET_API_KEY };
  try {
    await transport.sendMail(email);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};
module.exports = mailJetMessage;