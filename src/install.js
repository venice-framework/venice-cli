const { log } = require("../utils");
const { selectRepo, confirm } = require("../lib/inquirer");

const repoURLs = {
  venice: ["venice", "git@github.com:venice-framework/venice.git"],
  "python-producer": [
    "python-producer-test",
    "git@github.com/venice-framework/python-producer-test",
  ],
  "python-consumer": [
    "python-consumer",
    "git@github.com/venice-framework/python-consumer",
  ],
};

const install = {
  install: async () => {
    const answers = await selectRepo();
    log(answers.repo);

    // parse answer to construct command
    confirm("download and install", "this repo"); // confirm before installing
    // if no quit
    // if yes, pass in command
  },
};

module.exports = install;
