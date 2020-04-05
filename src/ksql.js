import { log, error, exec } from "../utils";
import { Docker } from "docker-cli-js";
const dockerInstance = new Docker();

const ksql = {
  startCLI: async () => {
    const start = await dockerInstance.command(
      " run --rm --name ksql-cli -it --network=venice-python_default confluentinc/cp-ksql-cli:5.4.1 http://ksql-server:8088"
    );

    if (!start) {
      error(`${services} could not be restarted`);
      return;
    } else {
      docker.status();
      log(`${services} restarted successfully`);
    }

    await Promise.reject(new Error("Whoops!"));
  }
};

module.exports = ksql;
