const zlib = require("zlib");
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
    // TODO - make sure this switch statement works with all the aliases
    switch (command) {
      case "print":
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
    const resp = await fetch(KSQL_API_URL, {
      method: "POST",
      body: JSON.stringify(json),

      headers: {
        "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
        Accept: "application/vnd.ksql.v1+json"
      }
    });
    return resp.json();
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
    const json = {
      ksql: "SHOW TOPICS;",
      topics: {} // I'm not sure what this line does on the request
    };

    const resp = await TOPICS.kqslPOST(json, KSQL_API_URL);
    const topics = await TOPICS.parseTopicResponse(resp);

    if (!topics) {
      throw new Error(
        "Unable to get topics, please make sure kafka brokers are running"
      );
    }
    return topics;
  },

  printTopics: async () => {
    const topics = await TOPICS.getTopics();
    await TOPICS.printAllTopics(topics);
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

  printAllTopics: topics => {
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
  },

  showTopic: async () => {
    // TODO - refactor so this isn't all in this method
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
        log(`BODY: ${chunk}`); // I think this was teh problem I was having - I wasn't using on data.
      });
      res.on("end", () => {
        log("No more data in response.");
      });
    });

    req.on("error", e => {
      error(`problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(json));
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
    // TODO - I MIGHT BE ABLE TO FIX THIS NOW SO THAT IT DOESN'T ALWAYS PRINT FROM THE BEGINING.
    return {
      ksql: `PRINT ${answers.topic} FROM BEGINNING;`,
      streamsProperties: {}
    };
  }
};

// This removes topics that are returned by ksql that don't belong to the user.
module.exports = TOPICS;
