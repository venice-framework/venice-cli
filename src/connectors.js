const { getTopics } = require("./topics");
const fs = require("fs");
const { log, error, fetch, inquirer, divider } = require("../utils");
const debug = require("debug");

// CONSTANTS
const CONNECT_URL = "http://localhost:8083/connectors";
// const CONNECT_URL = "http://kafka-connect:8083/connectors";

const CONNECT = {
  // DOCS -    // error parsing  - https://docs.confluent.io/current/connect/references/restapi.html
  // DOCS for woerk config - https://docs.confluent.io/current/connect/references/allconfigs.html
  // Confirm we have kafka-connect in distributed mode
  // TODO - change connector so its not hard coded to buses. Maybe we just have venice database.
  // TODO success message if 201.
  // TODO Connectors Status
  // TODO connector plugings
  // get installed plugins in the cluster
  // error parsing  - https://docs.confluent.io/current/connect/references/restapi.html
  // TODO success message if 201.
  parseConnectorCommand: args => {
    // TODO - make sure this switch statement works with all the aliases
    switch (args.c) {
      case "new":
        CONNECT.newConnection();
        break;
      case true:
        CONNECT.getConnectors();
        break;

      default:
        error(
          "Please ensure you've entered a valid command for connectors. To see commands type `venice --help`"
        );
        break;
    }
  },

  getConnectors: (print = false) => {
    fetch(CONNECT_URL)
      .then(res => res.json())
      .then(CONNECT.getAllConnectorsStatus)
      .then(CONNECT.printConnectors)
      .catch(err => error(err));
  },

  getAllConnectorsStatus: connectors => {
    return Promise.all(
      connectors.map(async name => {
        let status = await fetch(`${CONNECT_URL}/${name}/status`);
        return status.json();
      })
    );
  },

  printConnectors: connectors => {
    log(`There are ${connectors.length} connectors:`);
    connectors.forEach(con => {
      if (con.state === "FAILED") {
        error(
          `${con.name} is ${con.connector.state} with ${con.tasks.length} tasks`
        );
      } else {
        log(
          `${con.name} is ${con.connector.state} with ${con.tasks.length} tasks`
        );
      }
      con.tasks.forEach(task => {
        if (task.state === "FAILED") {
          error(`Task ${task.id} is ${task.state}`);
        } else {
          log(`Task ${task.id} is ${task.state}`);
        }
      });
      divider();
    });
  },

  newConnection: async () => {
    // TODO - error parsing
    // TODO - Success message.
    const topics = await getTopics();
    const questions = CONNECT.setQuestions(topics);
    const answers = await CONNECT.promptUserInput(questions);
    const mergedAnswers = CONNECT.mergeAnswersWithTemplate(answers, topics);

    CONNECT.postNewConnectorRequest(mergedAnswers)
      .then(resp => {
        if (resp.error_code) {
          error(
            "Something went wrong with your connection. Kafka-Connect error message: "
          );
          error(resp.message);
        } else {
          log(
            `Successfully added ${resp.name} as connection and saved config at ./created_connectors/postgres/${resp.name}.json` // TODO - update if we get elastic search working
          );
        }
      })
      .catch(err => log(err));
  },

  setQuestions: topics => {
    // Add try/catch here for if topics doesn't exist (aka the service isn't reachable)
    // TODO - Add error message explaining that unable to get topics.
    return [
      {
        type: "list",
        name: "sink",
        message: "which data sink are you adding new connection?",
        choices: ["Postgres", "Elastic Search"]
      },
      {
        type: "input",
        name: "connector_name",
        message: "What would you like to name the new sink connection?"
      },
      {
        type: "list",
        name: "topic",
        message: "which topic do you want to sink?",
        choices: topics
      },
      {
        type: "list",
        name: "insert_mode",
        message: "Do you want insert or upsert as insert mode?",
        choices: [
          "insert: Create new rows - if there is a primary key clash there will be a postgres error",
          "upsert: Insert or update rows - if primary key exists, row will be updated. If not then a new row is created"
        ]
      }
    ];
  },

  promptUserInput: questions => {
    return inquirer.prompt(questions);
  },

  mergeAnswersWithTemplate: (answers, topics) => {
    // TODO - Need to think about the number of tasks, its based on the number of topics and the number of partitions
    // TODO - make it an option to have multiple topics
    // TODO - need to think about key deserialisation.
    // TODO - how do we get the database name - currently hardcoded to buses
    // TODO - need to think about how many tasks to spin up - should be equal to the number of partitions for the topic.
    // TODO - will this filepath from anywhere?
    let response;

    if (answers.sink === "Postgres") {
      response = CONNECT.postgresCompleteTemplate(answers, topics);
    }

    return response;
  },

  postgresCompleteTemplate: (answers, topics) => {
    const filepath = `./created_connectors/postgres-${answers.connector_name}.json`;
    let template = JSON.parse(
      fs.readFileSync("./lib/postgres-sink-connector-template.json")
    );

    template.name = answers.connector_name;
    template.config["topics"] = answers.topic;
    template.config["connector.class"] =
      "io.confluent.connect.jdbc.JdbcSinkConnector";
    template.config["connection.url"] = "jdbc:postgresql://postgres:5432/buses";
    template.config["tasks.max"] = CONNECT.calculateTasks(
      answers.topic,
      topics
    );

    if (/upsert/.test(answers.insert_mode)) {
      template.config["insert.mode"] = "upsert";
    } else {
      template.config["insert.mode"] = "insert";
    }

    fs.writeFileSync(filepath, JSON.stringify(template));
    return template;
  },

  calculateTasks: (selectedTopic, topics) => {
    const info = topics.find(topic => topic.name == selectedTopic);
    return String(info.partitions);
  },

  postNewConnectorRequest: async answers => {
    // #TODO
    const resp = await fetch(CONNECT_URL, {
      method: "POST",
      body: JSON.stringify(answers),
      headers: { "Content-Type": "application/json" }
    });
    return resp.json();
  }
};

module.exports = CONNECT;
