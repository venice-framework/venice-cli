// const chalk = require("chalk");
// const clear = require("clear");
const clui = require("clui");
const color = require("cli-color");
// const exec = require("child_process").exec;
const execPromise = require("child-process-promise").exec;
const fetch = require("node-fetch");
const inquirer = require("inquirer");
// const parseArgs = require("minimist");
const spawnPromise = require("child-process-promise").spawn;
const Spinner = require("clui").Spinner;

const blue = color.xterm(68);
const orange = color.xterm(209);

const util = {
  blue,
  clui,
  color,
  execPromise,
  fetch,
  inquirer,
  spawnPromise,
  Spinner,
  log: (msg) => {
    console.log(blue(msg));
  },

  error: (msg) => {
    console.log(orange(msg));
  },

  divider: () => {
    console.log(blue("---------------------------------"));
  },

  divider2: () => {
    console.log(blue("--------------------------------------------------"));
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
