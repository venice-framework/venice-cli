import { blue, error, execPromise, log, spawnPromise, Spinner } from "../utils";
const multiple = require("../lib/inquirer").selectMultipleServices;

const docker = {
  down: () => {
    const status = new Spinner(log("Venice is shutting down, please wait..."));
    const launch = execPromise("docker-compose down");
    const statusText = blue("Docker containers closing...");
    status.start();
    status.message(statusText);

    launch.then(() => {
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

    const restart = execPromise(`docker restart ${services}`);
    const status = new Spinner(
      log("Venice is attempting to restart your containers. Please wait...")
    );
    const statusText = "Restarting...";

    status.start();
    status.message(statusText);

    restart
      .then(() => {
        status.stop();
        docker.status();
        log(`${services} restarted successfully`);
      })
      .catch(err => {
        status.stop();
        if (services === "") {
          error("No service was selected.");
        } else {
          error(`${services} could not be restarted`);
          error(err);
        }
      });
  },

  status: () => {
    const status = new Spinner(log("Fetching Venice status, please wait..."));
    const statusText = blue("loading...");

    const launch = execPromise("docker ps");

    status.start();
    status.message(statusText);
    launch.then(result => {
      status.stop();
      log(result.stdout);
    });
  },

  up: () => {
    let launch = execPromise("docker-compose up -d --build");
    const status = new Spinner(log("Venice is starting, please wait..."));
    const statusText = blue("Docker containers spinning up...");
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
