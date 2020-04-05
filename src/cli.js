const fetch = require("node-fetch"); // can remove?
const parseArgs = require("minimist");
const clear = require("clear"); // can remove?
const inquirer = require("inquirer"); // can remove?
const connectorParse = require("./connectors");
const getTopics = require("./topics");
const getSchemas = require("./schemas"); // should this be schemaParse?
const docker = require("./docker");

const log = arg => console.log(arg); // can remove?

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

// this is the logic for the CLI.
export function cli(rawArgs) {
  const args = parseArgs(rawArgs);
  log(args);
  if (args.connectors || args.c) {
    connectorParse(args);
  } else if (args.schemas || args.s) {
    schemaParse(args);
  } else if (args.topics || args.t) {
    getTopics();
  }

  if (args.down) {
    docker.down();
  } else if (args.log) {
    docker.log();
  } else if (args.restart) {
    docker.restart();
  } else if (args.status) {
    docker.status();
  } else if (args.up) {
    docker.up();
  }
}
