const http = require("http");
const { log, error, fetch, divider } = require("../utils");
const { promptUserInput } = require("../lib/inquirer");

const KSQL_API_URL = "http://localhost:8088/ksql";
const KSQL_QUERY_URL = "http://localhost:8088/query";

const validTopicCommands = `
  "venice topics": prints all the current topics
  "venice topics show": print a specific topic

  "venice -t" is an alias for "venice topics" and will work with all of these commands
`;

const TOPICS = {
  parseTopicCommand: command => {
    switch (command) {
      case "show":
        TOPICS.showTopic();
        break;
      case false:
        TOPICS.printTopics();
        break;

      default:
        error(
          `"${command}" is not a valid topic command. The list of valid commands are:

          ${validTopicCommands}`
        );
        break;
    }
  },

  kqslPOST: async json => {
    try {
      const resp = await fetch(KSQL_API_URL, {
        method: "POST",
        body: JSON.stringify(json),

        headers: {
          "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
          Accept: "application/vnd.ksql.v1+json"
        }
      });
      return resp.json();
    } catch (err) {
      error(err);
    }
  },

  ksqlQuery: async json => {
    return await fetch(KSQL_QUERY_URL, {
      method: "POST",
      body: JSON.stringify(json),

      headers: {
        "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
        "accept-encoding": "gzip,deflate"
      }
    });
  },

  getTopics: async (toPrint = false) => {
    try {
      const json = {
        ksql: "SHOW TOPICS;",
        topics: {} // I'm not sure what this line does on the request
      };

      const resp = await TOPICS.kqslPOST(json, KSQL_API_URL);
      const topics = await TOPICS.parseTopicResponse(resp);

      return topics;
    } catch (err) {
      error(err);
    }
  },

  printTopics: async () => {
    try {
      const topics = await TOPICS.getTopics();

      if (topics.length === 0) {
        log("There are no topics currently ");
        return;
      }

      log(`There are ${topics.length} topics:`);
      divider();
      topics.forEach(topic => {
        log(`${topic.name} with ${topic.partitions} partitions`);
      });
      return topics;
    } catch (err) {
      divider();
      error(
        "Please make sure ksqlDB container is available. This error occurs most often if you've just launched the pipeline and the containers aren't ready."
      );
    }
  },

  parseTopicResponse: resp => {
    const defaultTopics = /(connect-1|default_ksql|connect|_schemas)/;
    const topicList = resp[0].topics.filter(topic => {
      return !defaultTopics.test(topic.name);
    });

    const topics = topicList.map(topic => {
      return {
        name: topic.name,
        partitions: topic.replicaInfo.reduce((acc, cur) => acc + cur)
      };
    });
    return topics;
  },

  showTopic: async () => {
    try {
      const topics = await TOPICS.getTopics();
      const questions = TOPICS.setQuestions(topics);
      const answers = await promptUserInput(questions);
      const json = TOPICS.createFollowJSON(answers);

      const options = {
        host: "localhost",
        port: "8088",
        path: "/query",
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8"
        }
      };

      const req = http.request(options, res => {
        res.setEncoding("utf8");
        res.on("data", chunk => {
          const entries = TOPICS.parseChunk(chunk);
          if (entries) {
            TOPICS.printTopicEntries(entries);
          }
        });
        res.on("end", () => {
          log("No more data in response.");
        });
      });

      req.on("error", e => {
        error(`problem with request: ${e.message}`);
      });

      req.write(JSON.stringify(json));
    } catch (err) {
      divider();
      error(
        "Please make sure ksqlDB container is available. This error occurs most often if you've just launched the pipeline and the containers aren't ready."
      );
    }
  },

  parseChunk: chunk => {
    const chunkedEntries = chunk.split(/\n/);
    return chunkedEntries.map(entry => {
      let result = {};
      // The entry is a string like "timstamp, key, {value1, value2, value3}". Hence, the weird parsing below.
      // Splitting on commas to get the timestamp and key
      const parsedEntry = entry.split(/, /);
      result.timestamp = parsedEntry[0];
      result.key = parsedEntry[1];

      // splitting at the start of the hash to get the values.
      const getValues = entry.split("{");
      result.values = `{${getValues[1]}`;

      return result;
    });
  },

  printTopicEntries: entries => {
    entries.forEach(entry => {
      if (entry.timestamp) {
        log(`Timestamp: ${entry.timestamp}`);
        log(`Key: ${entry.key}`);
        log(`Value: ${entry.values}`);
        divider();
      }
    });
  },

  setQuestions: topics => {
    if (!topics) {
      throw new Error(
        "Unable to get topics, please make sure kafka brokers are running"
      );
    } else {
      return [
        {
          type: "list",
          name: "topic",
          message: "Which topic do you want to print",
          choices: topics
        }
      ];
    }
  },

  createFollowJSON: answers => {
    return {
      ksql: `PRINT ${answers.topic} FROM BEGINNING;`,
      streamsProperties: {}
    };
  }
};

module.exports = TOPICS;
