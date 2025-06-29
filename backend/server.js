const yargs = require("yargs"); // to read command arguments from terminal
const { hideBin } = require("yargs/helpers"); // to automatically extract the terminal command

const {
  initRepo,
  addFiles,
  pushRepo,
  pullRepo,
  revertRepo,
  commitRepo,
} = require("./controllers");

yargs(hideBin(process.argv))
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to repository",
    (yargs) =>
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      }),
    (yargs) => addFiles(yargs)
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) =>
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      }),
    commitRepo
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
    revertRepo
  )
  .demandCommand(1, "You need to give atleast one command")
  .help().argv;
