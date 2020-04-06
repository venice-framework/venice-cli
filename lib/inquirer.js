import { log, parseAnswers } from "../utils";
const inquirer = require("inquirer");

// TODO - extract gettopic to here.

const dockerContainers = [
  "broker-1",
  "broker-2",
  "broker-3",
  "elasticsearch",
  "kafka-connect",
  "ksql-server",
  "postgres",
  "schema-registry",
  "zookeeper"
];

const queries = {
  selectMultipleServices: async command => {
    const action = command === "log" ? "monitor" : "restart";

    const options = await inquirer.prompt({
      type: "checkbox",
      name: `${action}`,
      message: log(
        `Select the Venice services which you would like to ${action}.\n` +
          "Press enter/return with no selection to exit.\n"
      ),
      choices: dockerContainers
    });
    return parseAnswers(options);
  },
  selectSingleService: async command => {
    const action = command === "log" ? "monitor" : "restart";
    const answer = await inquirer.prompt({
      type: "list",
      name: `${action}`,
      message: log(
        `Select the Venice service which you would like to ${action}.`
      ),
      choices: dockerContainers
    });

    return answer[action];
  },

  promptUserInput: questions => {
    return inquirer.prompt(questions);
  }
};

module.exports = queries;
