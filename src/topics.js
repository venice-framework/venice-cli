const KSQL_API_URL = "http://localhost:8088/ksql";
const log = arg => console.log(arg);
const fetch = require("node-fetch");

const getTopics = () => {
  const json = {
    ksql: "SHOW TOPICS;",
    topics: {}
  };

  fetch(KSQL_API_URL, {
    method: "POST",
    body: JSON.stringify(json),

    headers: { "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8" }
  })
    .then(res => res.json())
    .then(parseTopicResponse)
    .catch(err => log(err));
};

const parseTopicResponse = resp => {
  const defaultTopics = /(kafka-connect|default_ksql|ksql-connect)/;
  const topicList = resp[0].topics.filter(topic => {
    return !defaultTopics.test(topic.name);
  });

  const topics = topicList.map(topic => topic.name);
  console.log(topics);
  return topics;
  // # TODO - I think this might need to return a promise
};

module.exports = getTopics;
