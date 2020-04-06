const KSQL_API_URL = "http://localhost:8088/ksql";
const { log, error, fetch, divider } = require("../utils");
const { promptUserInput } = require("../lib/inquirer");

const TOPICS = {
  parseTopicCommand: args => {
    // TODO - make sure this switch statement works with all the aliases
    switch (args.t) {
      case "show":
        TOPICS.showTopic();
        break;
      case true:
        TOPICS.printTopics();
        break;

      default:
        error(
          "Please ensure you've entered a valid command for topics. To see commands type `venice --help`"
        );
        break;
    }
  },

  kqslPOST: async json => {
    const resp = await fetch(KSQL_API_URL, {
      method: "POST",
      body: JSON.stringify(json),

      headers: { "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8" }
    });

    return resp.json();
  },

  getTopics: async (toPrint = false) => {
    const json = {
      ksql: "SHOW TOPICS;",
      topics: {} // I'm not sure what this line does on the request
    };

    const resp = await TOPICS.kqslPOST(json);
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
    console.log(topics);
    await TOPICS.printAllTopics(topics);
  },

  parseTopicResponse: resp => {
    const defaultTopics = /(kafka-connect|default_ksql|ksql-connect)/;
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
    log(`There are ${topics.length} topics:`);
    divider();
    topics.forEach(topic => {
      log(`${topic.name} with ${topic.partitions} partitions`);
    });
    return topics;
  },

  showTopic: async () => {
    const topics = await TOPICS.getTopics();
    const questions = TOPICS.setQuestions(topics);
    const answers = await promptUserInput(questions);
    console.log(answers);
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
          name: "sink",
          message: "Which topic do you want to print",
          choices: topics
        },
        {
          type: "list",
          name: "topic",
          message:
            "Would you like to follow new entries or print from the beginning THEN follow new entries?",
          choices: ["From beginning and follow", "Only follow"]
        }
      ];
    }
  }
};

// This removes topics that are returned by ksql that don't belong to the user.
module.exports = TOPICS;
