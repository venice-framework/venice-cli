const fetch = require("node-fetch");

const parseArgs = require("minimist");
const clear = require("clear");
const inquirer = require("inquirer");
const connectorParse = require("./connectors");
const getTopics = require("./topics");

const log = arg => console.log(arg);

//  URLS

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KAFKA_URL = "http://broker-1:9092";
const KSQL_API_URL = "http://localhost:8088/ksql";

export function cli(rawArgs) {
  const args = parseArgs(rawArgs);
  log(args);
  if (args.connectors) {
    connectorParse(args);
  } else if (args.schemas) {
    schemaParse(args);
  } else if (args.topics) {
    getTopics();
  }
}

// TOPICS

// SCHEMAS

const schemaLogic = args => {
  if (args.new) {
    newConnector();
  } else {
    showSchemas();
  }
};

const showSchemas = () => {
  fetch(SCHEMA_URL)
    .then(res => res.json())
    .then(json => log(json))
    .catch(err => log(err));
  // TODO - LOOK to do the prettier version saved in lib/show-connectors.js
};
