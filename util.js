const chalk = require("chalk");

const util = {
  log: msg => {
    console.log(chalk.hex("#96D6FF").dim(msg));
  },
  
  error: msg => {
    console.log(chalk.hex("#BC390C").dim(msg));
  },
};

module.exports = util;