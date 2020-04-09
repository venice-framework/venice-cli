const { blue, clui, divider2, log } = require("../utils");
const Line = clui.Line;

const commands = [
  ["down", "", "shut down the venice pipeline"],
  // ["elasticsearch", "-es", ""] // uncomment if we get this working - otherwise remove this
  ["install", "-i", "download and install a venice component from GitHub"],
  ["ksql", "-k", "launch the ksqlDB CLI"],
  ["logs", "-l", "view logs of venice components"],
  ["psql", "-p", "launch the postgreSQL CLI"],
  ["restart", "-r", "restart venice components"],
  ["schemas", "-s", "view schemas saved in the Schema Registry"],
  ["status", "-st", "view the status of venice components"],
  ["up", "", "launch the venice pipeline"],
];

const connectorCommands = [
  ["connectors", "-c", "view existing connectors and their status"],
  [
    "connectors new",
    "-c new",
    "create a new connection to an existing data sink",
  ],
  ["connectors delete", "-c delete", "delete an existing connection"],
];

const topicCommands = [
  ["topics", "-t", "view a list of the current topics"],
  [
    "topics show",
    "-t show",
    "view the event stream from an existing topic in the terminal",
  ],
];

const manual = {
  displayManual: () => {
    log("\nUsage:  venice COMMAND");
    log("\nBasic development commands for the Venice pipeline\n");

    let headers = new Line()
      .padding(2)
      .column("Command", 20, [blue])
      .column("Alias", 12, [blue])
      .column("Function", 55, [blue])
      .fill()
      .output();

    divider2();

    commands.forEach((command) => {
      new Line()
        .padding(2)
        .column(command[0], 20, [blue])
        .column(command[1], 12, [blue])
        .column(command[2], 55, [blue])
        .fill()
        .output();
    });

    divider2();
    log("Connect Commands");
    divider2();

    connectorCommands.forEach((command) => {
      new Line()
        .padding(2)
        .column(command[0], 20, [blue])
        .column(command[1], 12, [blue])
        .column(command[2], 55, [blue])
        .fill()
        .output();
    });

    divider2();
    log("Topic Commands");
    divider2();
    topicCommands.forEach((command) => {
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
  },
};

module.exports = manual;
