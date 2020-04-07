import { log, error, execPromise, spawnPromise, Spinner } from "../utils";

// get the current networks
const fetchNetworks = async () => {
  return execPromise("docker network ls");
};

// get the network name that contains 'venice'
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

const ksql = {
  startCLI: async () => {
    const network = await getNetworkName();
    new Spinner(
      log(
        "Launching the KSQL CLI.\nThis will load the CLI container and may" +
          " take several minutes.\nPlease wait..."
      )
    );

    const cmd =
      `docker run --rm --name ksql-cli -it --network=${network} ` +
      "confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088";
    const launchKsql = spawnPromise(cmd, {
      stdio: "inherit",
      shell: true
    });
    launchKsql.catch(result => {
      error(`ERROR: ${result.stderr}`);
    });
  }
};

module.exports = ksql;

// lanchKsql borrows logic from this repo, specifically the `runDocker.js` file:
// https://github.com/garris/BackstopJS/pull/925/commits/51a8872ef615363376b75da53426f8946adb29c7
