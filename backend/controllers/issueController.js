const createIssue = (req, res) => {
  res.send("createIssue");
};

const updateIssue = (req, res) => {
  res.send("updateIssue");
};

const deleteIssue = (req, res) => {
  res.send("deleteIssue");
};

const getAllIssues = (req, res) => {
  res.send("getAllIssues");
};

const getIssueById = (req, res) => {
  res.send("getIssueById");
};

module.exports = {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
};
