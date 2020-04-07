const { blue, clui, divider2, log } = require("../utils");
const Line = clui.Line;

const commands = [
  ["connectors", "-c", "view current connectors"],
  ["down", "", "close venice pipeline"],
  // ["elasticsearch", "-es", ""][("ksql", "-k", "launch ksql CLI")], // uncomment if we get this working - otherwise remove this
  ["log", "-l", "view logs of veince components"],
  // ["postgres", "-p", "add a postgres container to the pipeline"], // uncomment if we are able to add this functionality, otherwise remove
  ["schemas", "-s", "view current schema"],
  ["status", "-st", "status of venice components"],
  ["topics", "-t", "view current topics"],
  ["up", "", "launch venice pipeline"]
];

const manual = {
  displayManual: () => {
    log("\nUsage:  venice COMMAND");
    log("\nSimple development commands for the Venice pipeline\n");

    let headers = new Line()
      .padding(2)
      .column("Command", 15, [blue])
      .column("Alias", 10, [blue])
      .column("Function", 30, [blue])
      .fill()
      .output();

    divider2();

    commands.forEach(command => {
      new Line()
        .padding(2)
        .column(command[0], 15, [blue])
        .column(command[1], 10, [blue])
        .column(command[2], 30, [blue])
        .fill()
        .output();
    });

    log(
      "\nTo view this guide at any time, use 'venice man' or 'venice --help'.\n"
    );
  }
};

module.exports = manual;
