const parseArgs = require("minimist");
const fetch = require("node-fetch");

const log = arg => console.log(arg);

export function cli(rawArgs) {
  const args = parseArgs(rawArgs);
  log(args);
  if (args.connectors) {
    connectorCommands(args);
  }
}

// connectors
const CONNECTORS_URL = "http://localhost:8083/connectors";
const connectorCommands = args => {
  if (args.new) {
    newConnector();
  } else {
    showConnectors();
  }
};

const showConnectors = () => {
  fetch(CONNECTORS_URL)
    .then(res => res.json())
    .then(json => log(json));
  // TODO - LOOK to do the prettier version saved in lib/show-connectors.js
};

const newConnector = () => {
  // TODO - extract json to lib/insert-connector
  // TODO - think of someway to have have insert OR upsert

  let info = require("../lib/insert-connector.json");
  log(info);

  fetch(CONNECTORS_URL, {
    method: "POST",
    body: JSON.stringify(info),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(json => log(json));
};
