const express = require("express");
const userController = require("../controllers/userController");
const { authUser } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", authUser, userController.getUserProfile);
userRouter.get(
  "/userStarredRepositories/:id",
  authUser,
  userController.getStarredRepositoriesOfUser
);
userRouter.patch(
  "/toggleFollowUser/:id",
  authUser,
  userController.toggleFollowUser
);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

module.exports = userRouter;
