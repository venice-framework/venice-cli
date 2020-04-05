const exec = require("child_process").exec;

import { Docker } from "docker-cli-js";
import { log, error } from "../util";
const inquirer = require("../lib/inquirer");
const single = inquirer.selectSingleService;
const multiple = inquirer.selectMultipleServices;

// import { selectSingleService, selectMultipleServices } from "../lib/inquirer";
// import { askWhichServices } from "../lib/inquirer";

// TODO:
// add spinner to up and down commands (if possible with exec library)

const dockerInstance = new Docker();

const docker = {
  // TODO add spinner or progress text e.g shutting down broker 1, shutting down zookeper
  down: () => {
    exec("docker-compose down").on("close", () => {
      log("Venice has shut down.");
    });
  },

  // also not working yet - same code as `log` - but doesn't return an error
  restart: async () => {
    const services = await askWhichServices("restart");
    log(services);
    try {
      start = await execa("docker", `restart ${services}`);
    } catch (err) {
      err(err);
      return;
    }
    docker.status();
    log(`${services} restarted successfully`);
  },
  //restartMany(services, options) - Restart services
  // restartOne(service, options) - Restart service

  status: () => {
    exec("docker ps", (err, stdout, stderr) => {
      log(stdout.trim());
    });
  },

  up: () => {
    exec("docker-compose up -d --build").on("close", () => {
      log("Venice is now running.");
    });
  },

  // this command asks which of the Venice services they want to see logs for
  // they'll have to use the standard `docker logs -f` command for their own containers
  // ** WIP: not currently accepting the command **
  log: async () => {
    // determine which service they want to log - can only log 1 at a time
    const services = await single("log");

    // pipe logs to the console
    try {
      dockerInstance.command(`logs -f ${services}`);
    } catch (err) {
      error(`There's no running container called ${services}`);
    }
  }
};

// How Chronos handles logging, but I tried this approach and it also didn't work
// const logs = service => {
//   if (SERVICES.includes(service)) {
//     exec(`docker-compose logs ${service}`, (err, stdout, stderr) =>
//       log(stdout)
//     );
//   } else {
//     log(`${service} is not a valid service.`);
//     log(`format: chronos logs (service)
//       ${SERVICE_LISTING}`);
//   }
// };

module.exports = docker;
