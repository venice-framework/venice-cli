const { log } = require("../utils");
const { selectRepo, confirm } = require("../lib/inquirer");

const repoURLs = {
  venice: [
    "venice-postgres-sink",
    "git@github.com:venice-framework/venice.git",
  ],
  "python-producer": [
    "python-producer",
    "git@github.com/venice-framework/python-producer-test",
  ],
  "python-consumer": [
    "python-consumer",
    "git@github.com/venice-framework/python-consumer",
  ],
};

const install = {
  install: async () => {
    const answer = await selectRepo();
    const repo = answer.repo.split(" - ")[0];
    const options = {
      directoryName: repoURLs[repo][0],
      repoURL: repoURLs[repo][1],
    };
    // log(`${options.directoryName}, ${options.repoURL}`);

    let confirmation = await confirm("download and install", repo); // confirm before installing
    if (!confirmation) {
      return;
    } else {
      const command = `git clone ${options.repoURL} ${options.directoryName}`;
      log(command);
    }
  },
};

module.exports = install;
