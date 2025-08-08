const sendVerificationEmail = require("./EmailService");

const sendEmailFun = async ({ sendTo, subject, text, html }) => {
  const result = await sendVerificationEmail(sendTo, subject, text, html);
  return result.success ? true : false;
};

module.exports = { sendEmailFun };