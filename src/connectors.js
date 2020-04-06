const { getTopics } = require("./topics");
const fs = require("fs");
const { log, error, fetch, divider } = require("../utils");
const { promptUserInput } = require("../lib/inquirer");
const debug = require("debug");

const validConnectorsCommands = `
  "venice connectors": prints all current connectors and their status
  "venice connectors new": process to create a new connection

  "venice -c" is an alias for "venice connectors" and will work with all of these commands
`;

// CONSTANTS
const CONNECT_URL = "http://localhost:8083/connectors";
// const CONNECT_URL = "http://kafka-connect:8083/connectors";

const CONNECT = {
  // DOCS -    // error parsing  - https://docs.confluent.io/current/connect/references/restapi.html
  // DOCS for woerk config - https://docs.confluent.io/current/connect/references/allconfigs.html
  // TODO - Confirm we have kafka-connect in distributed mode
  // TODO - change connector so its not hard coded to buses. Maybe we just have venice database.
  parseConnectorCommand: command => {
    switch (command) {
      case "new":
        CONNECT.newConnection();
        break;
      case false:
        CONNECT.printTopics();
        break;

      default:
        error(
          `"${command}" is not a valid connector command. The list of valid commands are:

          ${validConnectorsCommands}`
        );
        break;
    }
  },

  printTopics: () => {
    CONNECT.getConnectors()
      .then(CONNECT.getAllConnectorsStatus)
      .then(CONNECT.printConnectors)
      .catch(err => error(err));
  },

  getConnectors: () => {
    return fetch(CONNECT_URL)
      .then(res => res.json())
      .catch(err => error(err));
  },

  getAllConnectorsStatus: connectors => {
    return Promise.all(
      connectors.map(async name => {
        let status = await fetch(`${CONNECT_URL}/${name}/status`);
        return status.json();
      })
    );
  },

  printConnectors: connectors => {
    if (connectors.length === 0) {
      log("There are no connectors currently ");
      return;
    }

    log(`There are ${connectors.length} connectors:`);
    connectors.forEach(con => {
      if (con.state === "FAILED") {
        error(
          `${con.name} is ${con.connector.state} with ${con.tasks.length} tasks`
        );
      } else {
        log(
          `${con.name} is ${con.connector.state} with ${con.tasks.length} tasks`
        );
      }
      con.tasks.forEach(task => {
        if (task.state === "FAILED") {
          error(`Task ${task.id} is ${task.state}`);
        } else {
          log(`Task ${task.id} is ${task.state}`);
        }
      });
      divider();
    });
  },

  newConnection: async () => {
    const topics = await getTopics();
    const questions = CONNECT.setQuestions(topics);
    const answers = await promptUserInput(questions);
    const mergedAnswers = CONNECT.mergeAnswersWithTemplate(answers, topics);
    const newConnectorFilePath = `./created_connectors/postgres-${answers.connector_name}.json`;

    CONNECT.postNewConnectorRequest(mergedAnswers)
      .then(resp => {
        if (resp.error_code) {
          error(
            "Something went wrong with your connection. Kafka-Connect error message: "
          );
          error(resp.message);
        } else {
          fs.writeFileSync(newConnectorFilePath, JSON.stringify(mergedAnswers));
          log(
            `Successfully added ${resp.name} as connection and saved config at ./created_connectors/postgres/${resp.name}.json` // TODO - update if we get elastic search working
          );
        }
      })
      .catch(err => log(err));
  },

  setQuestions: topics => {
    if (!topics) {
      throw new Error(
        "Unable to get topics, please make sure kafka brokers are running"
      );
    } else {
      return [
        {
          type: "list",
          name: "sink",
          message: "Which data sink are you adding new connection?",
          choices: ["Postgres", "Elastic Search"]
        },
        {
          type: "input",
          name: "connector_name",
          message: "What would you like to name the new sink connection?"
        },
        {
          type: "list",
          name: "topic",
          message: "Which topic do you want to sink?",
          choices: topics
        },
        {
          type: "list",
          name: "insert_mode",
          message: "Do you want insert or upsert as insert mode?",
          choices: [
            "insert: Create new rows - if there is a primary key clash there will be a postgres error",
            "upsert: Insert or update rows - if primary key exists, row will be updated. If not then a new row is created"
          ]
        }
      ];
    }
  },

  mergeAnswersWithTemplate: (answers, topics) => {
    // TODO - make it an option to have multiple topics
    // TODO - Upsert needs to work with PK
    // TODO - need to think about key deserialisation.
    // TODO - how do we get the database name - currently hardcoded to buses
    // TODO - will this filepath work from anywhere?
    let response;

    if (answers.sink === "Postgres") {
      response = CONNECT.postgresCompleteTemplate(answers, topics);
    }

    return response;
  },

  postgresCompleteTemplate: (answers, topics) => {
    let template = JSON.parse(
      fs.readFileSync("./lib/postgres-sink-connector-template.json")
    );

    template.name = answers.connector_name;
    template.config["topics"] = answers.topic;
    template.config["connector.class"] =
      "io.confluent.connect.jdbc.JdbcSinkConnector";
    template.config["connection.url"] = "jdbc:postgresql://postgres:5432/buses";
    template.config["tasks.max"] = CONNECT.calculateTasks(
      answers.topic,
      topics
    );

    if (/upsert/.test(answers.insert_mode)) {
      template.config["insert.mode"] = "upsert";
    } else {
      template.config["insert.mode"] = "insert";
    }

    return template;
  },

  calculateTasks: (selectedTopic, topics) => {
    const info = topics.find(topic => topic.name == selectedTopic);
    return String(info.partitions);
  },

  postNewConnectorRequest: async answers => {
    const resp = await fetch(CONNECT_URL, {
      method: "POST",
      body: JSON.stringify(answers),
      headers: { "Content-Type": "application/json" }
    });

    console.log(resp.json());
    return resp.json();
  }
};

module.exports = CONNECT;
