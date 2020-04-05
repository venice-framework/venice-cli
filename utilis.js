const chalk = require("chalk");
const fetch = require("node-fetch");
const clear = require("clear");
const parseArgs = require("minimist");
const inquirer = require("inquirer");

const util = {
  parseArgs,
  inquirer,
  fetch,
  clear,
  log: msg => {
    console.log(chalk.hex("#96D6FF").dim(msg));
  },

  error: msg => {
    console.log(chalk.hex("#BC390C").dim(msg));
  }
};

module.exports = util;
