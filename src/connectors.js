const inquirer = require("inquirer");
const { getTopics } = require("./topics");
const fs = require("fs");
const { log, logError, fetch } = require("../util");
const debug = require("debug");

// CONSTANTS
const CONNECT_URL = "http://localhost:8083/connectors";
// const CONNECT_URL = "http://kafka-connect:8083/connectors";

const connectors = {
  // DOCS -    // error parsing  - https://docs.confluent.io/current/connect/references/restapi.html
  // DOCS for woerk config - https://docs.confluent.io/current/connect/references/allconfigs.html
  // Confirm we have kafka-connect in distributed mode
  // TODO - change connector so its not hard coded to buses. Maybe we just have venice database.
  // TODO success message if 201.
  // TODO Connectors Status
  // TODO connector plugings
  // get installed plugins in the cluster
  // error parsing  - https://docs.confluent.io/current/connect/references/restapi.html
  // TODO success message if 201.
  parseConnectorCommand: args => {
    if (args.new) {
      connectors.newConnectionProcess();
    } else {
      connectors.getConnectors();
      debug(connectors);
    }
  },

  getConnectors: () => {
    fetch(CONNECT_URL)
      .then(res => res.json())
      .then(json => log(json, "test"))
      .catch(err => logError(err));

    // TODO - LOOK to do the prettier version saved in lib/show-connectors.js
  },

  newConnectionProcess: () => {
    // TODO - error parsing
    // TODO - Success message.
    getTopics()
      .then(setQuestions)
      .then(promptUserInput)
      .then(mergeAnswersWithTemplate)
      .then(postNewConnectorRequest)
      .catch(err => log(err));
  },

  setQuestions: topics => {
    // Add try/catch here for if topics doesn't exist (aka the service isn't reachable)
    // TODO - Add error message explaining that unable to get topics.
    return [
      {
        type: "list",
        name: "sink",
        message: "which data sink are you adding new connection?",
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
        message: "which topic do you want to sink?",
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
  },

  promptUserInput: questions => {
    return inquirer.prompt(questions);
  },

  mergeAnswersWithTemplate: answers => {
    // TODO - Need to think about the number of tasks, its based on the number of topics and the number of partitions
    // TODO - make it an option to have multiple topics
    // TODO - need to think about key deserialisation.
    // TODO - how do we get the database name - currently hardcoded to buses
    // TODO - need to think about how many tasks to spin up - should be equal to the number of partitions for the topic.

    log(answers);
    let template = JSON.parse(
      fs.readFileSync("../lib/postgres-sink-connector-template.json")
    );

    log(template);
    template.name = answers.connector_name;
    template.config["topics"] = answers.topic;

    if (answers.sink === "Postgres") {
      template.config["connector.class"] =
        "io.confluent.connect.jdbc.JdbcSinkConnector";
      template.config["connection.url"] =
        "jdbc:postgresql://postgres:5432/buses";
    }

    if (/upsert/.test(answers.insert_mode)) {
      template.config["insert.mode"] = "upsert";
    } else {
      template.config["insert.mode"] = "insert";
    }

    return template;
  },

  postNewConnectorRequest: answers => {
    // #TODO
    fetch(CONNECT_URL, {
      method: "POST",
      body: JSON.stringify(answers),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(json => log(json)); // there is a way to turn these two steps into one method that you call. I can't remember it atm
  }
};

module.exports = connectors;
