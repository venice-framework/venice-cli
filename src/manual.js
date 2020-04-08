const { blue, clui, divider2, log } = require("../utils");
const Line = clui.Line;

const commands = [
  ["install", "-i", "select a venice-pipeline to download from GitHub"],

  ["up", "", "launch venice pipeline"],

  ["down", "", "shut down venice pipeline"],
  ["status", "-st", "status of venice components"],
  // ["elasticsearch", "-es", ""][("ksql", "-k", "launch ksql CLI")], // uncomment if we get this working - otherwise remove this
  ["logs", "-l", "view logs of venice components"],
  ["restart", "-r", "restart venice components"],
  ["psql", "-p", "launch the postgreSQL CLI"],
  ["ksql", "-k", "launch the ksqlDB CLI"],
  ["schemas", "-s", "view current schemas saved in the Schema Registry"]
];

const connectorCommands = [
  ["connectors", "-c", "view current connectors and their status"],
  ["connectors new", "-c new", "create a new connection to existing data sink"],
  ["connectors delete", "-c delete", "delete an existing connection"]
];

const topicCommands = [
  ["topics", "-t", "view a list of the current topics"],
  ["topics show", "-t show", "stream events from an existing topic to terminal"]
];

const manual = {
  displayManual: () => {
    log("\nUsage:  venice COMMAND");
    log("\nBasic development commands for the Venice pipeline\n");

    let headers = new Line()
      .padding(2)
      .column("Command", 20, [blue])
      .column("Alias", 13, [blue])
      .column("Function", 50, [blue])
      .fill()
      .output();

    divider2();

    commands.forEach(command => {
      new Line()
        .padding(2)
        .column(command[0], 20, [blue])
        .column(command[1], 13, [blue])
        .column(command[2], 50, [blue])
        .fill()
        .output();
    });

    divider2();
    log("Connect Commands");
    divider2();

    connectorCommands.forEach(command => {
      new Line()
        .padding(2)
        .column(command[0], 20, [blue])
        .column(command[1], 13, [blue])
        .column(command[2], 50, [blue])
        .fill()
        .output();
    });

    divider2();
    log("Topic Commands");
    divider2();
    topicCommands.forEach(command => {
      new Line()
        .padding(2)
        .column(command[0], 20, [blue])
        .column(command[1], 13, [blue])
        .column(command[2], 50, [blue])
        .fill()
        .output();
    });

    log(
      "\nTo view this guide at any time, use 'venice man' or 'venice --help'.\n"
    );
  }
};

module.exports = manual;
