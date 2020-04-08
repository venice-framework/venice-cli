import { log, error, execPromise, spawnPromise, Spinner } from "../utils";
const queries = require("../lib/inquirer");
const getUsernameDBname = queries.getUsernameDBname;

const psql = {
  psqlCLI: async () => {
    const answers = await getUsernameDBname();
    new Spinner(log("Launching the Postgres CLI. Please wait..."));

    const cmd =
      `docker exec -it postgres psql --username=${answers.username} ` +
      `--dbname=${answers.dbname}`;
    const launchPsql = spawnPromise(cmd, {
      stdio: "inherit",
      shell: true
    });
    launchPsql.catch(result => {
      error(`ERROR: ${result.stderr}`);
    });
  }
};

module.exports = psql;
