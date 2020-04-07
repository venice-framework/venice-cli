const docker = require("./docker");
const { parseConnectorCommand } = require("./connectors");
const { parseTopicCommand } = require("./topics");
const { parseSchemaCommand } = require("./schemas");

//  URLS - eventually these should all be docker URLS or ENV variables

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
      break;

    case "psql":
      break;

    case "elastic-search":
      break;

    default:
      break;
  }
}
