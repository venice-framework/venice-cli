const docker = require("./docker");

const { parseConnectorCommand } = require("./connectors");
const { parseTopicCommand } = require("./topics");
const { parseSchemaCommand } = require("./schemas");
const { error } = require("../utils");
const { startCLI } = require("./ksql");

//  URLS - eventually these should all be docker URLS or ENV variables
// TODO - Make a --help and have that displayed if somebody puts in an invalid command
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
      error(
        "TODO - You've entered an invalid command. The list of valid commands are: "
      );
      break;
  }
}
