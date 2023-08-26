let token;
const {NylasCongif} =require("../nylas-config");

const getUsers = (req, res) => {
  res.send("User list");
};

const sendEmail = (req, res) => {
  const userData = req.body;
  token = "t4qLPsX1c2KMCXpGMP3Qe6BVce0xBx";
  const nylas = NylasCongif.with(token);
  nylas.messages.first({in: 'sent'}).then(message =>{
    console.log(`Subject: ${message.subject} | ID: ${message.id} | Unread: ${message.unread}`);
  });
  res.status(200).send("mail send successfully");
};

module.exports = {
  getUsers,
  sendEmail,
};
