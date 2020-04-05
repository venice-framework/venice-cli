const KSQL_API_URL = "http://localhost:8088/ksql";
const { log, error, fetch, inquirer } = require("../util");

const TOPICS = {
  getTopics: (toPrint = false) => {
    const json = {
      ksql: "SHOW TOPICS;",
      topics: {} // I'm not sure what this line does on the request
    };

    return fetch(KSQL_API_URL, {
      method: "POST",
      body: JSON.stringify(json),

      headers: { "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8" }
    })
      .then(res => res.json())
      .then(TOPICS.parseTopicResponse)
      .then(topics => TOPICS.print(topics, toPrint))
      .catch(err => log(err));
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

  print: (topics, toPrint) => {
    if (toPrint) {
      log(`There are ${topics.length} topics:`);
      topics.forEach(topic => {
        log(`${topic.name} with ${topic.partitions} partitions`);
      });
    }
    return topics;
  }
};

// This removes topics that are returned by ksql that don't belong to the user.
module.exports = TOPICS;
