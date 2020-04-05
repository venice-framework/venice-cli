import { Docker } from "docker-cli-js";
import { log, error, exec } from "../utils";
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
  // TODO confirmclear this won't shut down all docker compose files!
  down: () => {
    exec("docker-compose down").on("close", () => {
      log("Venice has shut down.");
    });
  },

  restart: async () => {
    const services = await multiple("restart");

    const start = await dockerInstance.command(`restart ${services}`);
    if (!start) {
      error(`${services} could not be restarted`);
      return;
    } else {
      docker.status();
      log(`${services} restarted successfully`);
    }
  },

  status: () => {
    exec("docker ps", (err, stdout, stderr) => {
      log(stdout.trim());
    });
  },

  // TODO: add an async await to make sure this actually runs & return error if there is a conflict (another container with same name, etc.)
  up: () => {
    exec("docker-compose up -d --build").on("close", () => {
      log("Venice is now running.");
    });
  },

  // TODO: not formatting error correctly - refactor to use promises error handling
  log: async () => {
    // determine which service they want to log - can only log 1 at a time
    const service = await single("log");

    const logs = await dockerInstance.command(`logs -f ${service}`);
    if (!logs) {
      error(`${service} isn't present`);
      return;
    }
  }
};

module.exports = docker;
