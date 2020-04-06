import { log, error, exec } from "../utils";
import { Docker } from "docker-cli-js";
const dockerInstance = new Docker();

const options = {
  machineName: null,
  currentWorkingDirectory: null,
  echo: false
};

// function to determine which Docker network the person is running
const determineNetwork = async () => {
  // let network;
  // dockerInstance
  //   .command("network ls", options)
  //   .then(data => {
  //     network = data.split(" ").find(el => el.includes("venice"));
  //     log(network);
  //     return network;
  //   })
  //   .catch(err => {
  //     error(err);
  //   });

  // currently returns an object - looking for a string!
  return exec("docker network ls", (err, stdout, stderr, network) => {
    return stdout
      .trim()
      .split(" ")
      .find(el => el.includes("venice"));
  });
};

const ksql = {
  startCLI: async () => {
    try {
      await determineNetwork().then(data => {
        log(data);
      });
      // log(network);
    } catch (err) {
      error(err);
    }

    // log(network);
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
