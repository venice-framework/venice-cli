const chalk = require("chalk");
const fetch = require("node-fetch");
const clear = require("clear");
const parseArgs = require("minimist");
const inquirer = require("inquirer");
const exec = require("child_process").exec;
const execPromise = require("child-process-promise").exec;
const spawnPromise = require("child-process-promise").spawn;
const Spinner = require("clui").Spinner;

const util = {
  exec,
  execPromise,
  spawnPromise,
  parseArgs,
  fetch,
  clear,
  Spinner,
  inquirer,
  log: msg => {
    console.log(chalk.hex("#96D6FF").dim(msg));
  },

  error: msg => {
    console.log(chalk.hex("#BC390C").dim(msg));
  },

  divider: () => {
    console.log(
      chalk.hex("#3282B8").dim("---------------------------------") //
    );
  },

  // TODO add CLI error for invalid command.

  // module.exports = (message, exit) => {
  // console.error(message)
  // exit && process.exit(1)
  // }
  //
  // https://timber.io/blog/creating-a-real-world-cli-app-with-node/

  parseAnswers: options => {
    let values = [];
    for (let [key1, value1] of Object.entries(options)) {
      for (let [key2, value2] of Object.entries(value1)) values.push(value2);
    }
    return values.join(" ");
  }
};

module.exports = util;
