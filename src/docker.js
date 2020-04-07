import { Docker } from "docker-cli-js";
import { log, error, exec, execPromise, spawnPromise, Spinner } from "../utils";
const inquirer = require("../lib/inquirer");
const multiple = inquirer.selectMultipleServices;

const dockerInstance = new Docker();

// TODO: `restart` and `log` (the functions that use docker-cli-js `dockerInstance`)
// are duplicating the error
// first uncaught - prints in white - then prints the caught error in color as expected

const docker = {
  down: () => {
    const status = new Spinner(log("Venice is shutting down, please wait..."));
    const launch = exec("docker-compose down");
    const statusText = "Docker containers closing...";
    status.start();
    status.message(statusText);

    launch.on("close", () => {
      status.stop();
      log("Venice has shut down.");
    });
  },

  log: async () => {
    const services = await multiple("log");
    spawnPromise(`docker-compose logs -f ${services}`, {
      stdio: "inherit",
      shell: true
    }).catch(err => {
      error(err);
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
    const statusText = "Docker containers closing...";

    let msg;
    const launch = exec("docker ps", (err, stdout, stderr) => {
      msg = stdout.trim();
    });
    status.start();
    status.message(statusText);
    launch.on("close", () => {
      status.stop();
      log(msg);
    });
  },

  up: () => {
    let launch = execPromise("docker-compose up -d --build");
    const status = new Spinner(log("Venice is starting, please wait..."));
    const statusText = "Docker containers spinning up...";
    status.start();
    status.message(statusText);

    launch
      .then(() => {
        status.stop();
        log("Venice is now running.");
      })
      .catch(err => {
        status.stop();
        error(err);
      });
  }
};

module.exports = docker;
