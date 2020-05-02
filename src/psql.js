import { log, error, spawnPromise, Spinner, config } from "../utils";

const psql = {
  psqlCLI: async () => {
    new Spinner(log("Launching the Postgres CLI. Please wait..."));

    const cmd =
      `docker exec -it postgres psql --username=${config.POSTGRES_USER} ` +
      `--dbname=${config.POSTGRES_DB}`;
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
