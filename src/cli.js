const fetch = require("node-fetch");

const parseArgs = require("minimist");
const clear = require("clear");
const inquirer = require("inquirer");
const connectorParse = require("./connectors");
const getTopics = require("./topics");
const getSchemas = require("./schemas");
const docker = require("./docker");

const log = arg => console.log(arg);

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

// outlines the commands and their aliases
// ** just playing with this idea - not sure if it's a good one ** 
// const argumentsIntoOptions = rawArgs => {
//   const args = parseArgs(
//     {
//       "--connector": Boolean,
//       "--down": Boolean,
//       "--elastic": Boolean,
//       "--ksql": Boolean,
//       "--log": Boolean,
//       "--schema": Boolean,
//       "--status": Boolean,
//       "--restart": Boolean,
//       "--topic": Boolean,
//       "--psql": Boolean,
//       "--up": Boolean,
//       "-c": "--connector",
//       "-s": "--schema",
//       "-t": "--topic",
//       "-r": "--restart"
//     },
//     {
//       argv: rawArgs.slice(2)
//     }
//   );
//   console.log(args);
//   console.log(argv);

//   return {
//     connector: args["--connector"] || false,
//     down: args["--down"] || false,
//     elastic: args["--elastic"] || false,
//     ksql: args["--ksql"] || false,
//     log: args["--log"] || false,
//     psql: args["--psql"] || false,
//     restart: args["--restart"] || false,
//     schema: args["--schema"] || false,
//     status: args["--status"] || false,
//     topic: args["--topic"] || false,
//     up: args["--up"] || false
//   };
// };

// this is the logic for the CLI.
export function cli(rawArgs) {
  // const args = argumentsIntoOptions(rawArgs);
  const args = parseArgs(rawArgs);
  // log(args);
  if (args.connectors) {
    connectorParse(args);
  } else if (args.schemas) {
    schemaParse(args);
  } else if (args.topics) {
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
