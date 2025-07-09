const getAllUsers = (req, res) => {
  res.send("All users fetched!");
};

const signup = (req, res) => {
  res.send("Signing Up!");
};

const login = (req, res) => {
  res.send("Logging in!");
};

const getUserProfile = (req, res) => {
  res.send("Profile feached!");
};

const updateUserProfile = (req, res) => {
  res.send("Profile updated!");
};

const deleteUserProfile = (req, res) => {
  res.send("Profile deleted!");
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  signup,
  login,
};
