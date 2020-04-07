# Venice Framework Command Line Interface

## Simple development commands for the Venice pipeline

### Installation

<!-- add installation instructions here-->

### Usage

Issue the following commands to use the Venice framework

**Syntax**: `venice COMMAND`

| Command    | Alias | Function                                  |
| ---------- | ----- | :---------------------------------------- |
| connectors | -c    | view current connectors                   |
| down       |       | close venice pipeline                     |
| ksql       | -k    | launch the KSQL CLI                       |
| logs       | -l    | view logs of venice components            |
| postgres   | -pg   | pull the venice-postgres-sink from GitHub |
| psql       | -p    | launch the postgreSQL CLI                 |
| restart    | -r    | restarts selected venice components       |
| schemas    | -s    | view current schemas                      |
| status     | -st   | status of selected venice components      |
| topics     | -t    | view current topics                       |
| up         |       | launch venice pipeline                    |

`connectors` - <!-- add special notes for connectors commands -->
<br>
`logs` - select which Venice components to monitor. use arrow keys to navigate the output. `CTRL+C` to exit
<br>
`psql` - will require your username and database name
`restart` - select which Venice components to restart
<br>
`status` - <!-- add special notes for status commands -->
<br>
`topics` - <!-- add special notes for topics commands -->
