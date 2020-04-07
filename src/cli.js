import { parse } from "querystring";

const { parseTopicCommand } = require("./topics");
const getSchemas = require("./schemas"); // should this be schemaParse?
const docker = require("./docker");
const { log, parseArgs } = require("../utils"); // remove parseArgs?
const { parseConnectorCommand } = require("./connectors");
const { startCLI } = require("./ksql");

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

const checkForAlias = command => {
  const aliases = {
    "-c": "connectors",
    "-s": "schemas",
    "-t": "topics",
    "-r": "restart",
    "-st": "status",
    "-es": "elastic-search"
  };

  return aliases[command] || command;
};

const argumentsIntoOptions = rawArgs => {
  let service = rawArgs[2];
  const command = rawArgs[3] || false;
  service = checkForAlias(service);

  return { service, command };
};

export function cli(rawArgs) {
  const { service, command } = argumentsIntoOptions(rawArgs);

  switch (service) {
    case "connectors":
      parseConnectorCommand(command);
      break;

    case "topics":
      parseTopicCommand(command);
      break;

    case "schemas":
      parseSchemaCommand(command);
      break;

    case "up":
      docker.up();
      break;

    case "down":
      docker.down();
      break;

    case "status":
      docker.status();
      break;

    case "restart":
      docker.restart();
      break;

    case "log":
      docker.log();
      break;

    case "ksql":
      startCLI();
      break;

    case "psql":
      break;

    case "elastic-search":
      break;

    default:
      break;
  }
}
