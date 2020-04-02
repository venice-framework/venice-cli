const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');


// clear the terminal after the command is issued
clear();

// display our project name in blue ASCII art
console.log(
  chalk.hex('#3282b8').dim(
    figlet.textSync('VENICE', { horizontalLayout: 'full' })
  )
);

// // another option is to simply display the name, slightly brighter and underlined (no ASCII)
// console.log(
//   chalk.hex('#3282b8').underline('VENICE')
// );
