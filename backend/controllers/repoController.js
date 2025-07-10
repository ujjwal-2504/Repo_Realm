const createRepository = (req, res) => {
  res.send("Repository created!!");
};

const getAllRepositories = (req, res) => {
  res.send("getAllRepositories");
};

const fetchRepositoryById = (req, res) => {
  res.send("fetchRepositoryById");
};

const fetchRepositoryByName = (req, res) => {
  res.send("fetchRepositoryByName");
};

const fetchRepositoryForCurrentUser = (req, res) => {
  res.send("fetchRepositoryForCurrentUser");
};

const updateRepositoryById = (req, res) => {
  res.send("updateRepositoryById!");
};

const toggleVisibilityById = (req, res) => {
  res.send("toggleVisibilityById");
};

const deleteRepositoryById = (req, res) => {
  res.send("deleteRepositoryById");
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
