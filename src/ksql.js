import { log, error, exec, execPromise, Spinner } from "../utils";
import { Docker } from "docker-cli-js";
const dockerInstance = new Docker();

// get the current networks
const fetchNetworks = async () => {
  return execPromise("docker network ls");
};

// get the network name thta contains 'venice'
const parseNetwork = networksOutput => {
  return networksOutput
    .trim()
    .split(" ")
    .find(el => el.includes("venice"));
};

// bundles two above functions to actually return network name
const getNetworkName = async () => {
  let network = await fetchNetworks().then(result => {
    return parseNetwork(result.stdout);
  });
  return network;
};

// TODO = add a wait spinner while it connects
const ksql = {
  startCLI: async () => {
    const network = await getNetworkName();
    const status = new Spinner(log("Starting up the KSQL CLI. Please wait..."));
    const statusText = "connecting...";

    let cmd = "docker-compose exec ksql-cli ksql http://ksql-server:8088";

    let launchKsql = execPromise(cmd);
    status.start();
    status.message(statusText);
    launchKsql
      .then(() => {
        status.stop();
      })
      .catch(result => {
        error(`ERROR: ${result.stderr}`);
      })
      .finally(() => status.stop());

    // launchKsql.catch(err => error(err));

    // // full command - with 'docker' to start
    // let cmd =
    //   `docker run --rm --name ksql-cli -it --network=${network} ` +
    //   "confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088";

    // // with 'docker' - without TTY
    // let cmd =
    //   `docker run --rm --name ksql-cli -i --network=${network} ` +
    //   "confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088";

    // // without 'docker'
    // let cmd =
    //   `run --rm --name ksql-cli -it --network=${network} ` +
    //   "confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088";

    // // without 'docker' or pseudo TTY (-i instead of -it)
    // let cmd =
    //   `run --rm --name ksql-cli -i --network=${network} ` +
    //   "confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088";
    // // log(cmd);

    // exec(cmd, (err, stdout, stderr) => {
    //   error(err);
    // });

    // dockerInstance.command(cmd).catch(err => {
    //   error(err);
    // });

    // // docker run --rm --name ksql-cli -it --network=venice-python_default confluentinc/cp-ksql-cli:5.4.1

    // This version launches a "dumb terminal" not a "system terminal" - which doesn't seem to accept ksql commands
    // without 'docker' or pseudo TTY (-i instead of -it)

    // let cmd =
    //   `run --rm --name ksql-cli -i --network=${network} ` +
    //   "confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088";
    // dockerInstance.command(cmd).catch(err => {
    //   error(err);
    // });
  }
};

module.exports = ksql;
