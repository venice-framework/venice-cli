const child = require("child_process");
const exec = child.exec;
const stream = child.spawn;
const execa = require("execa");
const inquirer = require("inquirer");

import { log, error } from '../util'; 
// TODO:
// add spinner to up and down commands (if possible with exec library)

const log = msg => {
  console.log(chalk.hex("#96D6FF").dim(msg));
};

const err = msg => {
  console.log(chalk.hex("#BC390C").dim(`${msg.toUpperCase()}`));
};

const parseAnswers = options => {
  let values = [];
  for (let [key1, value1] of Object.entries(options)) {
    for (let [key2, value2] of Object.entries(value1)) values.push(value2);
  }
  values = values.join(" ");
  return values;
};

const askWhichServices = async command => {
  const action = command === "log" ? "monitor" : "restart";

  const options = await inquirer.prompt({
    type: "checkbox",
    name: "logs",
    message:
      `Select the Venice services which you would like to ${action}.\n` +
      "Press enter/return with no selection to exit.\n",
    choices: [
      "broker-1",
      "broker-2",
      "broker-3",
      "elasticsearch",
      "kafka-connect",
      "ksql-server",
      "postgres",
      "schema-registry",
      "zookeeper"
    ]
  });
  return parseAnswers(options);
};

const docker = {
  // TODO add spinner or progress text
  // TODO e.g shutting down broker 1, shutting down zookeper
  down: () => {
    exec("docker-compose down").on("close", () => {
      log("Venice has shut down.");
    });
  },

  // also not working yet - same code as `log` - but doesn't return an error
  restart: async () => {
    const services = await askWhichServices("restart");
    log(services);
    try {
      start = await execa("docker", `restart ${services}`);
    } catch (err) {
      err(err);
      return;
    }
    docker.status();
    log(`${services} restarted successfully`);
  },

  status: () => {
    exec("docker ps", (err, stdout, stderr) => {
      log(stdout.trim());
    });
  },

  up: () => {
    exec("docker-compose up -d --build").on("close", () => {
      log("Venice is now running.");
    });
  },

  // this command asks which of the Venice services they want to see logs for
  // they'll have to use the standard `docker logs -f` command for their own containers
  // ** WIP: not currently accepting the command **
  log: async () => {
    const services = await askWhichServices("log");
    const command = `logs -f ${services}`;

    try {

      await execa("docker", ['logs -f zookeeper']);
      await execa("docker", `logs -f ${await askWhichServices("log")}`);
      // await execa('docker', ['logs --follow zookeeper']);
    } catch (err) {
      error(err);
    }

    // let log = execa('docker', [`logs -f ${await askWhichServices("log")}`]).stdout.pipe(process.stdout);
    // let services = await askWhichServices("log");
    // log(`from in "log": ${services}`);

    // const log = await execa('docker', [`logs -f ${services}`]).stdout.pipe(process.stdout);

    // if (log.failed) {
    //   return Promise.reject(new Error(`Failed to log ${services}`));
    // }
    // await execa.command('echo', [services]).stdout.pipe(process.stdout);

    // execa('echo', ['unicorns']).stdout.pipe(process.stdout);

    // exec(`docker logs -f ${services}` , (err, stdout, stderr) => {
    //   log(stdout.trim());
    // });
  }
};

// How Chronos handles logging, but I tried this approach and it also didn't work
// const logs = service => {
//   if (SERVICES.includes(service)) {
//     exec(`docker-compose logs ${service}`, (err, stdout, stderr) =>
//       log(stdout)
//     );
//   } else {
//     log(`${service} is not a valid service.`);
//     log(`format: chronos logs (service)
//       ${SERVICE_LISTING}`);
//   }
// };

module.exports = docker;
