# Commands pulled from David's proposal

* `venice generate pipeline [pipeline name]`
  * Generates one of the pipelines? Not sure best way of handling this is it to have pre-built docker-compose yaml files for each pipeline?

* `venice launch pipeline`
  * trigger `docker-compose up -d` (may need to be `docker-compose up -d --build`)

* `venice show sinks`
  * Shows the information about the sink  containers

* `venice show topics`
  * Could either show all topics on kafka or show topics that are part of connectors

* `venice show connections`
  * Show the information about current connections

* `venice new connection [sink name] [topic name]`
  * This is where it starts to get more complex. If we want to let the user configure a whole bunch of stuff then I think one approach is this command creates a connection file and then you have another that is `venice send connection [filepath]` which would actually send the command

* `venice add-topic-to-connection [topic]`
  * Sends a PUT request to an existing topic

* `venice new sink [sink name]`
  * Don’t know how you add containers on the fly to the network if that's possible?

* `log [service]` (should this be `venice log [service]`?)
  * Prints the logs of a service to the terminal (`docker logs -f [service]`)

* `venice status [service]`
  * Prints the status of the services to the terminal

* `venice add task [filepath] [system]`
  * Add a jar file to kafka streams  or a sql file to ksql  on an existing pipeline.

* `show kafka-IP` (should this be `venice show kafka-IP`)
  * Shows where (not sure what is meant here?)
  