const { blue, error, execPromise, log, Spinner } = require("../utils");
const { selectRepo, confirm } = require("../lib/inquirer");

const repoURLs = {
  venice: [
    "venice-postgres-sink",
    "git@github.com:venice-framework/venice.git",
  ],
  "python-producer": [
    "bus-producer-test",
    "git@github.com:venice-framework/python-producer-test.git",
  ],
  "python-consumer": [
    "python-consumer",
    "git@github.com:venice-framework/python-consumer.git",
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

    let confirmation = await confirm("download and install", repo);
    if (!confirmation.affirm) {
      return;
    } else {
      const cmd = `git clone ${options.repoURL} ${options.directoryName}`;
      const status = new Spinner(
        blue(`Venice is downloading ${repo}. Please wait...`)
      );

      const download = execPromise(cmd);
      status.start();
      download
        .then(() => {
          log(`\n\nSUCCESS: venice component ${repo} was installed!`);
          log(
            `enter 'cd ${options.directoryName}' if you need to navigate into` +
              " that directory."
          );
        })
        .catch((err) => error(err))
        .finally(() => {
          status.stop();
        });
    }
  },
};

module.exports = install;
