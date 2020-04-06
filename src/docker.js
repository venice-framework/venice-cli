import { Docker } from "docker-cli-js";
import { log, error, exec, execPromise, Spinner } from "../utils";
const inquirer = require("../lib/inquirer");
const single = inquirer.selectSingleService;
const multiple = inquirer.selectMultipleServices;

const dockerInstance = new Docker();

// TODO: `restart` and `log` (the functions that use docker-cli-js `dockerInstance`)
// are duplicating the error
// first uncaught - prints in white - then prints the caught error in color as expected

const docker = {
  down: () => {
    const status = new Spinner(log("Venice is shutting down, please wait..."));
    const launch = exec("docker-compose down");
    status.start();

    launch.on("close", () => {
      status.stop();
      log("Venice has shut down.");
    });
  },

  restart: async () => {
    const services = await multiple("restart");

    dockerInstance
      .command(`restart ${services}`)
      .then(() => {
        docker.status();
        log(`${services} restarted successfully`);
      })
      .catch(err => {
        if (services !== "") {
          error(`${services} could not be restarted`);
        }
        error(err);
      });
  },

  status: () => {
    const status = new Spinner(log("Fetching Venice status, please wait..."));
    let msg;
    const launch = exec("docker ps", (err, stdout, stderr) => {
      msg = stdout.trim();
    });
    status.start();
    launch.on("close", () => {
      status.stop();
      log(msg);
    });
  },

  up: () => {
    let launch = execPromise("docker-compose up -d --build");
    const status = new Spinner(log("Venice is starting, please wait..."));
    status.start();

    launch
      .then(() => {
        status.stop();
        log("Venice is now running.");
      })
      .catch(err => {
        status.stop();
        error(err);
      });
  },

  log: async () => {
    // determine which service they want to log - can only log 1 at a time
    const service = await single("log");
    dockerInstance.command(`logs -f ${service}`).catch(err => {
      error(err);
    });
  }
};

module.exports = docker;
