let token;
const {NylasCongif} =require("../nylas-config");

const getUsers = (req, res) => {
  res.send("User list");
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  const nylas = NylasCongif.with(token);
  nylas.messages.first({in: 'sent'}).then(message =>{
    console.log(`Subject: ${message.subject} | ID: ${message.id} | Unread: ${message.unread}`);
  });
  res.send(`User details for user with ID: ${userId}`);
};

module.exports = {
  getUsers,
  getUserById,
};
