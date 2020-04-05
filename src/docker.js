const exec = require("child_process").exec;
const execPromise = require("child-process-promise").exec;
// const execa = require("execa");
const Spinner = require("clui").Spinner;

import { Docker } from "docker-cli-js";
import { log, error } from "../utils";
const inquirer = require("../lib/inquirer");
const single = inquirer.selectSingleService;
const multiple = inquirer.selectMultipleServices;

// import { selectSingleService, selectMultipleServices } from "../lib/inquirer";
// import { askWhichServices } from "../lib/inquirer";

// TODO:
// add spinner to up and down commands (if possible with exec library)

const dockerInstance = new Docker();

const docker = {
  // TODO confirm this won't shut down all docker compose files!
  down: () => {
    const status = new Spinner(log("Venice is shutting down, please wait..."));
    const launch = exec("docker-compose up -d --build");
    status.start();

    launch.on("close", () => {
      status.stop();
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

  // TODO: add an async await to make sure this actually runs
  // return error if there is a conflict (another container with same name, etc.)
  up: () => {
    const status = new Spinner(log("Venice is starting, please wait..."));
    const launch = exec("docker-compose up -d --build");
    status.start();

    launch.on("close", () => {
      status.stop();
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
