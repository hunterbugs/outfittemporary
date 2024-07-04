const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { RequestError, mailJetMessage } = require("../../helpers");

const { APP_URL = "http://localhost:4000", PORT } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.verify) {
    throw RequestError(409, "Email in use");
  }
  if (user && !user.verify) {
    return res.status(201).json({
      user: { name: user.name, email: user.email },
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const result = await User.create({
    name,
    email,
    password: hashPassword,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Slim-Mom verification email",
    Vars: {
      link: `${APP_URL}/api/users/verificate/${verificationToken}`,
    },
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verificate/${verificationToken}">Click to verify email</a>`,
  };

  await mailJetMessage(mail);
  console.log("mail: ", mail);

  res.status(201).json({
    user: { name: result.name, email: result.email },
  });
};

module.exports = register;
