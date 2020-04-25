import { blue, log, parseAnswers, inquirer } from "../utils";

const dockerContainers = [
  "broker-1",
  "broker-2",
  "broker-3",
  "kafka-ui",
  "kafka-connect",
  "ksql-server",
  "postgres",
  "schema-registry",
  "zookeeper",
];

const repos = [
  "venice - Base pipeline with a Postgres sink",
  "python-producer - Python-based streaming data Producer",
  "python-consumer - Python-based streaming data Consumer",
];

const queries = {
  getUsernameDBname: () => {
    const questions = [
      {
        name: "username",
        type: "input",
        message: blue(
          "Enter your postgres username:\n" +
            "If you are using the Venice default, input 'venice_user'"
        ),
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return blue(
              "Please enter your postgres username.\n" +
                "Remember the Venice default is 'venice_user'."
            );
          }
        },
      },
      {
        name: "dbname",
        type: "input",
        message: blue(
          "Enter the name of your postgres database:\n" +
            "If you are using the Venice default, input 'venice'"
        ),
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return blue(
              "Please enter the name of your postgres database.\n" +
                "Remember the Venice default is 'venice'.\n" +
                "If you are following the bus example, use 'buses'."
            );
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },

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
