const parseArgs = require("minimist");
const connectorParse = require("./connectors");
const getTopics = require("./topics");
const getSchemas = require("./schemas"); // should this be schemaParse?
const docker = require("./docker");

const { startCLI } = require("./ksql");

const log = arg => console.log(arg); // can remove?

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

// this is the logic for the CLI.
export function cli(rawArgs) {
  const args = parseArgs(rawArgs);
  if (args.connectors) {
    connectorParse(args);
  } else if (args.schemas) {
    schemaParse(args);
  } else if (args.topics) {
    getTopics();
  } else if (args.ksql) {
    startCLI();
  } else if (args.down) {
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
