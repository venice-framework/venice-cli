// TODO: determine why cli is being read insted of this file.

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

// clear the terminal after the command is issued
clear();

// display our project name in blue ASCII art
console.log(
  chalk
    .hex("#3282b8")
    .dim(figlet.textSync("VENICE", { horizontalLayout: "full" }))
);
