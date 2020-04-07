# Venice Framework Command Line Interface

Issue the following commands to use the Venice framework:

[Venice commands](https://docs.google.com/document/d/10vEsdJrRfqqxGMs3vKzOGFpyLz5yKkCekfVSczQSr68/edit)

## Commands that do stuff currently

You'll obviously need to have the python-venice environment running

- `venice connectors` - get the connectors
- `venice topics` - get the topics
- `venice up` - launches the pipeline
- `venice down` - stops the pipeline
- `venice status` - displays the status of all the Venice services
- `venice log` - asks which venice service user wants to log (singular)
- `venice restart` - asks which venices services user wants to restart (multiple)

---

Co-authored-by: David Perich <davidnperich@gmail.com>

## Dev Notes

Docker commands are executed using the [docker-cli-js package](https://www.npmjs.com/package/docker-cli-js). It can not handle `docker-compose` commands.

syntax:

```javascript
import { Docker } from "docker-cli-js"; // import the Docker constructor function from the module
const dockerInstance = new Docker(); //instantate a new docker instance
dockerInstance.command(`logs -f zookeeper`); // pass comands to docker

/* this can be in the syntax of Promises
dockerInstance.command('up').then(data => {
  console.log('data = ', data);
});

or with callbacks
dockerInstance.command('up', (err, data) => {
  console.log('data = ', data);
}); */
```

### Logging

Currently `venice --log` only outputs logs for a single Venice container at a time. To get logs for additional containers, the user would need to run the command again in a separate console window.

The logs will continuously output until `CMD+C` is entered.

If we wanted to log multiple containers with a single command, it would require rewriting the function to:

1. ask for multiple container names
2. parse the container names
3. map over them, transforming them into a longer bash command
   and they would lose the color formatting provided by docker for each service name.

The command I was considering is outlined in [this Stack Overflow post](https://stackoverflow.com/questions/32076878/logging-solution-for-multiple-containers-running-on-same-host).
I do not feel the extra work is worthwhile.
