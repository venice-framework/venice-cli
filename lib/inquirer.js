import { blue, parseAnswers, inquirer } from "../utils";

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
  "zookeeper",
];

const repos = [
  "venice - Base pipeline with a Postgres sink",
  // "venice-python", // "Base pipeline that can connect to the python-producer-test and python-consumer"
  "python-producer - Python-based streaming data Producer",
  "python-consumer - Python-based streaming data Consumer",
];

const queries = {
  selectMultipleServices: async (command) => {
    const action = command === "log" ? "monitor" : "restart";

    const options = await inquirer.prompt({
      type: "checkbox",
      name: `${action}`,
      message: blue(
        `Select the Venice services which you would like to ${action}.\n` +
          "Press enter/return with no selection to exit.\n"
      ),
      choices: dockerContainers,
    });
    return parseAnswers(options);
  },
  selectSingleService: async (command) => {
    const action = command === "log" ? "monitor" : "restart";
    const answer = await inquirer.prompt({
      type: "list",
      name: `${action}`,
      message: blue(
        `Select the Venice service which you would like to ${action}.`
      ),
      choices: dockerContainers,
    });

    return answer[action];
  },

  selectRepo: async () => {
    let questions = [
      {
        type: "list",
        name: "repo",
        message: blue(`Select the Venice service you would like to install.`),
        choices: repos,
      },
    ];
    return await inquirer.prompt(questions);
  },

  confirm: async (action, service) => {
    let questions = [
      {
        type: "confirm",
        name: "affirm",
        message: blue(`Are you sure you'd like to ${action} ${service}?`),
      },
    ];
    return await inquirer.prompt(questions);
  },

  promptUserInput: (questions) => {
    return inquirer.prompt(questions);
  },
};

module.exports = queries;
