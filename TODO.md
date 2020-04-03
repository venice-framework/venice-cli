START OR STOP EVERYTHING

| **venice command** | **alias**                    | **description**                                                                                        | **Progress** |
| ------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------ | ------------ |
| venice up          | docker-compose up -d --build | launches default pipeline: zookeeper3 brokers1 ksql1 or 3 kafka-connect (cluster)postgreselasticsearch |              |
| venice down        | docker-compose down          | stops containers                                                                                       |              |

COMMAND LINE INTERFACES

| **venice command** | **alias**                                         | **description**                  | **Progress** |
| ------------------ | ------------------------------------------------- | -------------------------------- | ------------ |
| venice psql        | the long docker command (see docker-compose file) | Connect to the postgres database |              |
| venice ksql        | the long docker command (see docker-compose file) | Connect to ksql                  |              |
| venice elastic     |                                                   | Connect to elastic search        |              |

CREATE

| **venice command**                                           | **alias**                               | **description**        | **Progress** |
| ------------------------------------------------------------ | --------------------------------------- | ---------------------- | ------------ |
| venice connector new [connectortype][connectorname] [topics] | Curl POST/ PUT request to kafka-connect | create a new connector |              |
| Venice connector add-topic [connector_name][topic(s)]        |                                         | create a new topic     |              |
|                                                              |                                         |                        |              |

READ

| **venice command**              | **alias**                              | **description**                     | **Progress** |
| ------------------------------- | -------------------------------------- | ----------------------------------- | ------------ |
| venice show topics              | maybe: ksql GET request to show topics | displays existing topics            |              |
| venice show connectors          |                                        |                                     |              |
| venice logs [OPTIONS] CONTAINER | docker logs [OPTIONS] CONTAINER        | displays logs of each container     |              |
| venice status                   | docker ps -a                           | show all containers                 |              |
| venice show ip                  |                                        | show IP for kafka broker            |              |
| venice show env                 |                                        | print the contents of the .env file |              |

UPDATE

| **venice command** | **alias** | **description** | **progress** |
| ------------------ | --------- | --------------- | ------------ |
|                    |           |                 |              |
|                    |           |                 |              |
|                    |           |                 |              |

DELETE

| **venice command**                      | **alias**                                                                                                        | **description**                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| venice connector remove [connectorname] | [https://rmoff.net/2018/12/03/kafka-connect-cli-tricks/](https://rmoff.net/2018/12/03/kafka-connect-cli-tricks/) | \* possibly use a checkbox to allow the user to select which to remove |
|                                         |                                                                                                                  |                                                                        |
|                                         |                                                                                                                  |                                                                        |
