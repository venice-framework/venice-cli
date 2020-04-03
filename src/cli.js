const fetch = require("node-fetch");

const parseArgs = require("minimist");
const clear = require("clear");
const inquirer = require("inquirer");
const connectorParse = require("./connectors");
const getTopics = require("./topics");
const getSchemas = require("./schemas");

const log = arg => console.log(arg);

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

// this is the logic for the CLI.

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
