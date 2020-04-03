// CONNECTORS
const fetch = require("node-fetch");
const CONNECT_URL = "http://kafka-connect:8083/connectors";
const inquirer = require("inquirer");
const getTopics = require("./topics");

const log = arg => console.log(arg); // move to utilities with fetch, inquirer and other things

const connectorParse = args => {
  if (args.new) {
    newConnectorQuestions();
  } else {
    getConnectors();
  }
};

const getConnectors = () => {
  fetch(CONNECT_URL)
    .then(res => res.json())
    .then(json => log(json))
    .catch(err => log(err));

  // TODO - LOOK to do the prettier version saved in lib/show-connectors.js
};

const newConnectorQuestions = () => {
  getTopics() // TODO - this is where I got too with new connector request
    .then(setQuestions)
    .then(questions => {
      inquirer.prompt(questions).then(answers => {
        console.log(JSON.stringify(answers, null, "  "));
      });
    })
    .then(mergeAnswers)
    .then(postConnector);
};
// TODO - prompt user for insert/upsert
// pull topics and have them as selectable
// have sinks as selectable

const setQuestions = topics => {
  return [
    {
      type: "list",
      name: "sink",
      message: "which data sink are you adding a new connector to?",
      choices: ["Postgres", "Elastic Search"]
    },
    {
      type: "input",
      name: "connector_name",
      message: "What would you like to name the new connector?"
    },
    {
      type: "list",
      name: "topics",
      message: "which topics do you want to sink as new tables",
      choices: topics
    },
    {
      type: "list",
      name: "insert_mode",
      message: "Do you want insert or upsert as insert mode?",
      choices: [
        "insert: just create new rows. If there is a primary key clash there will be a postgres error",
        "upsert: if primary key exists, row will be updated. If not then a new row is created"
      ]
    }
  ];
};

const mergeAnswers = answers => {
  let info = require("../lib/insert-connector.json");
  info.name = "chicken";
  log(info);
};

const postConnector = answers => {
  // fetch(CONNECT_URL, {
  //   method: "POST",
  //   body: JSON.stringify(answers),
  //   headers: { "Content-Type": "application/json" }
  // })
  //   .then(res => res.json())
  //   .then(json => log(json)) // there is a way to turn these two steps into one method that you call. I can't remember it atm
  //   .catch(err => log(err));
};

module.exports = connectorParse;
