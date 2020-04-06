const { parseTopicCommand } = require("./topics");
const getSchemas = require("./schemas"); // should this be schemaParse?
const docker = require("./docker");
const { log, parseArgs } = require("../utils");
const { parseConnectorCommand } = require("./connectors");

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

// this is the logic for the CLI.
export function cli(rawArgs) {
  // TODO - ADD print topics
  const args = parseArgs(rawArgs);
  console.log(args);
  if (args.connectors || args.c) {
    parseConnectorCommand(args);
  } else if (args.schemas || args.s) {
    schemaParse(args);
  } else if (args.topics || args.t) {
    parseTopicCommand(args); // pass in true here so that it will print. False is default value so topics don't get printed for internal getTopic requests
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
