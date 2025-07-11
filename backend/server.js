const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./Routes/main.router");

const yargs = require("yargs"); // to read command arguments from terminal
const { hideBin } = require("yargs/helpers"); // to automatically extract the terminal command

const envConfig = require("./env_import/envConfig");

const {
  initRepo,
  addFiles,
  pushRepo,
  pullRepo,
  revertRepo,
  commitRepo,
  debugStorage,
} = require("./controllers");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starting the server", {}, startServer)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <files...>",
    "Add a file to repository",
    (yargs) =>
      yargs.positional("files", {
        describe: "File to add to the staging area",
        type: "string",
      }),
    (argv) => addFiles(argv.files)
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) =>
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      }),
    (argv) => commitRepo(argv.message)
  )
  .command("push", "Push commit to S3", {}, pushRepo)
  .command("pull", "Pull commit to S3", {}, pullRepo)
  .command(
    "revert <commitId>",
    "Revert to a specific commit",
    (yargs) =>
      yargs.positional("commitId", {
        describe: "Commit id to revert to",
        type: "string",
      }),
    (argv) => revertRepo(argv.commitId)
  )
  .command("debug", "To run debugger function", {}, debugStorage)
  .demandCommand(1, "You need to give atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = envConfig.port || 3000;
  const mongoDbUri = envConfig.mongoDbUri;

  app.use(bodyParser.json());
  app.use(express.json());

  mongoose
    .connect(mongoDbUri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("Unable to connect with DB: ", err));

  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      user = userId;
      console.log("=======");
      console.log(user);
      console.log("=======");
      socket.join(userId);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CURD operations called");
    //CRUD Operation
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
