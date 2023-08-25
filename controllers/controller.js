const getUsers = (req, res) => {
  res.send("User list");
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  res.send(`User details for user with ID: ${userId}`);
};

module.exports = {
  getUsers,
  getUserById,
};
