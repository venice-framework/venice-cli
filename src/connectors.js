const { getTopics } = require("./topics");
const fs = require("fs");
const { log, error, fetch, divider, config } = require("../utils");
const { promptUserInput } = require("../lib/inquirer");
const CONNECT_URL = `${config.CONNECT_URL}/connectors`;

const validConnectorsCommands = `
  "venice connectors": Print all current connectors and their status
  "venice connectors new": Create a new connection
  "venice connectors delete": Delete a connection

  "venice -c" is an alias for "venice connectors" and will work with all of these commands
`;

const POSTGRES_TEMPLATE = {
  name: "PROVIDED BY INPUT",
  config: {
    "connection.user": `${config.POSTGRES_USER}`,
    "connection.password": `${config.POSTGRES_PASSWORD}`,
    topics: "PROVIDED BY INPUT",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": `${config.SCHEMA_REGISTRY_URL}`,
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "auto.create": "true",
    "auto.evolve": "true",
    "insert.mode": "PROVIDED BY INPUT",
    "tasks.max": "CALCULATED BY TOPIC PARTITION SIZED",
    "connection.url": `jdbc:postgresql://${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`
  }
};

const CONNECT = {
  parseConnectorCommand: command => {
    switch (command) {
      case "new":
        CONNECT.newConnection();
        break;
      case "delete":
        CONNECT.deleteConnection();
        break;
      case false:
        CONNECT.showConnectors();
        break;

      default:
        error(
          `"${command}" is not a valid connector command. The list of valid commands are:

          ${validConnectorsCommands}`
        );
        break;
    }
  },

  showConnectors: () => {
    CONNECT.getConnectors()
      .then(CONNECT.getAllConnectorsStatus)
      .then(CONNECT.printConnectors)
      .catch(err => {
        error(err);
        divider();
        error(
          "Please make sure the Kafka Connect container is available. This error happens most often if you've just launched the pipeline and the container isn't ready. "
        );
      });
  },

  getConnectors: () => {
    return fetch(CONNECT_URL)
      .then(res => res.json())
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
    if (connectors.length === 0) {
      log("There are no connectors currently ");
      return;
    }

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
    // LIMITATION - UPSERT only works if the key is a string.
    try {
      const topics = await getTopics();

      const questions = CONNECT.setQuestions(topics);
      const answers = await promptUserInput(questions);
      const mergedAnswers = await CONNECT.mergeAnswersWithTemplate(
        answers,
        topics
      );
      const newConnectorFilePath = `./created_connectors/postgres-${answers.connector_name}.json`;

      CONNECT.postNewConnectorRequest(mergedAnswers).then(resp => {
        if (resp.status === 201) {
          fs.mkdir("./created_connectors", { recursive: true }, err => {
            if (err) throw err;
          });

          fs.writeFileSync(newConnectorFilePath, JSON.stringify(mergedAnswers));
          log(
            `Successfully added ${mergedAnswers.name} as connection and saved config at ./created_connectors/postgres/${mergedAnswers.name}.json`
          );
        } else {
          throw new Error(
            `Request to Kafka-Connect failed with ${resp.status} status. Please check the logs`
          );
        }
      });
    } catch (err) {
      error(err);
      divider();
      error(
        "Please make sure the Kafka Connector Container and KSQL container are available. This error happens most often if you've just launched the pipeline and the container isn't ready."
      );
    }
  },

  setQuestions: topics => {
    if (!topics) {
      throw new Error(
        "Unable to get topics, please make sure kafka brokers are running"
      );
    } else {
      return [
        {
          type: "input",
          name: "connector_name",
          message: "What would you like to name the new sink connection?"
        },
        {
          type: "list",
          name: "topic",
          message: "Which topic do you want to sink?",
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
    }
  },

  mergeAnswersWithTemplate: async (answers, topics) => {
    // ROWKEY is harded coded as primary key for upsert. Typically ksql creators a column called ROWKEY as the primary key.

    let template = { ...POSTGRES_TEMPLATE };
    template.name = answers.connector_name;
    template.config["topics"] = answers.topic;
    template.config["connector.class"] =
      "io.confluent.connect.jdbc.JdbcSinkConnector";
    template.config["tasks.max"] = CONNECT.calculateTasks(
      answers.topic,
      topics
    );

    if (/upsert/.test(answers.insert_mode)) {
      template.config["insert.mode"] = "upsert";
      template.config["pk.mode"] = "record_key";
      template.config["pk.fields"] = "ROWKEY";
    } else {
      template.config["insert.mode"] = "insert";
    }

    return template;
  },

  calculateTasks: (selectedTopic, topics) => {
    const info = topics.find(topic => topic.name == selectedTopic);
    return String(info.partitions);
  },

  postNewConnectorRequest: async answers => {
    const json = await JSON.stringify(answers);

    const response = await fetch(CONNECT_URL, {
      method: "POST",
      body: json,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });

    return response;
  },

  deleteConnection: () => {
    CONNECT.getConnectors()
      .then(CONNECT.setDeleteQuestions)
      .then(promptUserInput)
      .then(CONNECT.postDeleteConnectorRequest)
      .then(resp => {
        if (resp.status === 204) {
          log("Connector deleted succesfully");
        }
      })
      .catch(err => error(err));
  },

  setDeleteQuestions: connectors => {
    if (connectors.length === 0) {
      throw new Error(
        "No connectors available. If all containers are running then this means there are no connectors."
      );
    }

    return [
      {
        type: "list",
        name: "connector",
        message:
          "Which connector woudl you like to delete? WARNING - this won't remove database tables",
        choices: connectors
      }
    ];
  },
  postDeleteConnectorRequest: async answers => {
    const path = `${CONNECT_URL}/${answers.connector}`;

    return await fetch(path, {
      method: "DELETE"
    });
  }
};

module.exports = CONNECT;
