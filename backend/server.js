const yargs = require("yargs"); // to read command arguments from terminal
const { hideBin } = require("yargs/helpers"); // to automatically extract the terminal command

const {
  initRepo,
  addFiles,
  pushRepo,
  pullRepo,
  revertRepo,
  commitRepo,
  debugStorage,
} = require("./controllers");

yargs(hideBin(process.argv))
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
