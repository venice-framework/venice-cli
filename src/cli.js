const docker = require("./docker");
const { parseConnectorCommand } = require("./connectors");
const { parseTopicCommand } = require("./topics");
const { parseSchemaCommand } = require("./schemas");
const { error } = require("../utils");
const { startCLI } = require("./ksql");
const { displayManual } = require("./manual");
const { install } = require("./install");
const { psqlCLI } = require("./psql");

//  URLS - eventually these should all be docker URLS or ENV variables - can this line be removed?

// TODO: do we need psql and elastic search commands?
// - if we don't get to implementing elasticsearch
// we should remove it from the list of containers to log or restart in inquirer
// and from the list of commands in manual

const checkForAlias = command => {
  const aliases = {
    "-c": "connectors",
    "-es": "elasticsearch",
    "-k": "ksql",
    "-l": "logs",
    "-i": "install",
    "-pg": "postgres",
    "-p": "psql",
    "-r": "restart",
    "-s": "schemas",
    "-st": "status",
    "-t": "topics",
    "--help": "man"
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

    case "down":
      docker.down();
      break;

    case "elasticsearch":
      break;

    case "ksql":
      startCLI();
      break;

    case "logs":
      docker.logs();
      break;

    case "man":
      displayManual();
      break;

    case "install":
      install();
      break;

    case "psql":
      psqlCLI();
      break;

    case "restart":
      docker.restart();
      break;

    case "schemas":
      parseSchemaCommand(command);
      break;

    case "status":
      docker.status();
      break;

    case "topics":
      parseTopicCommand(command);
      break;

    case "up":
      docker.up();
      break;

    default:
      error(
        "You've entered an invalid command. The list of valid commands are: "
      );
      displayManual();
      break;
  }
}
