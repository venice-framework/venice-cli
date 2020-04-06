import { log, error, exec, fetch } from "../utils";
const execPromise = require("child-process-promise").exec;
import { Docker } from "docker-cli-js";
const dockerInstance = new Docker();

const options = {
  machineName: null,
  currentWorkingDirectory: null,
  echo: false
};

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

const ksql = {
  startCLI: async () => {
    let network = await fetchNetworks().then(result => {
      return parseNetwork(result.stdout);
    });

    // const start = await dockerInstance.command(
    //   "run --rm --name ksql-cli -it --network=venice-python_default confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088"
    // );

    // if (!start) {
    //   error(`${services} could not be restarted`);
    //   return;
    // } else {
    //   docker.status();
    //   log(`${services} restarted successfully`);
    // }

    // await Promise.reject(new Error("Whoops!"));
  }
};

module.exports = ksql;
