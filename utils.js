const execPromise = require("child-process-promise").exec;
const fetch = require("node-fetch");
const inquirer = require("inquirer");
const spawnPromise = require("child-process-promise").spawn;
const Spinner = require("clui").Spinner;

const util = {
  execPromise,
  fetch,
  inquirer,
  spawnPromise,
  Spinner,
  log: (msg) => {
    console.log(chalk.hex("#96D6FF").dim(msg));
  },

  error: (msg) => {
    console.log(chalk.hex("#BC390C").dim(msg));
  },

  divider: () => {
    console.log(
      chalk.hex("#3282B8").dim("---------------------------------") //
    );
  },

  parseAnswers: (options) => {
    let values = [];
    for (let [key1, value1] of Object.entries(options)) {
      for (let [key2, value2] of Object.entries(value1)) values.push(value2);
    }
    return values.join(" ");
  },
};

module.exports = util;
