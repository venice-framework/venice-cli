const { log, err, fetch, clear } = require("../utilis");
const { parseConnectorCommand } = require("./connectors");
const { getTopics } = require("./topics");
const getSchemas = require("./schemas");

//  URLS - eventually these should all be docker URLS or ENV variables

const SCHEMA_URL = "http://schema-registry:8081/subjects";
const KSQL_API_URL = "http://localhost:8088/ksql";

export function cli(rawArgs) {
  // TODO - ADD print topics
  const args = parseArgs(rawArgs);
  log(args);
  if (args.connectors || args.c) {
    connectorParse(args);
  } else if (args.schemas || args.s) {
    schemaParse(args);
  } else if (args.topics || args.t) {
    getTopics();
  }
}
