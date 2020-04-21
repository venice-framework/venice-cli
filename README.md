# Venice Framework Command Line Interface

## Simple development commands for the Venice pipeline

### Installation Instructions

Requirements:

- [Node](https://nodejs.org) (created with version 13.8.0)
- [npm](https://www.npmjs.com/get-npm) (created with version 6.13.6)

[how to download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Steps:

1. Clone this repository

- `git clone git@github.com:venice-framework/venice-cli.git`

2. Navigate into the newly installed `venice-cli` directory

- `cd venice-cli`

3. Install packages

- `npm install` or `npm i`

4. Create a symbolic link

- `sudo npm link`

Or use this single command that combines the four steps above:

`git clone git@github.com:venice-framework/venice-cli.git && cd venice-cli && npm install && sudo npm link`

**Now you're ready to use the CLI from any console interface!** (It shouldn't be limited to this directory.)

### Usage

Issue the following commands to use the Venice framework

**Syntax**: `venice COMMAND`

#### Adminstrative Commands

| Command | Alias | Function                                            |
| :------ | :---- | :-------------------------------------------------- |
| down    |       | shut down the venice pipeline                       |
| install | -i    | download and install a venice component from GitHub |
| ksql    | -k    | launch the KSQL CLI                                 |
| logs    | -l    | view logs of venice components                      |
| psql    | -p    | launch the postgreSQL CLI                           |
| restart | -r    | restart venice components                           |
| schemas | -s    | view schemas saved in the Schema Registry           |
| status  | -st   | view the status of venice components                |
| up      |       | launch the venice pipeline                          |

##### Notes

- `install` will allow you to select which Venice components to install
- `logs` will ask which Venice components you want to monitor. Use arrow keys to navigate the output. `CTRL+C` to exit
- `psql` will require your username and database name
- `restart` will prompt you to select which Venice components to restart

---

#### Connector Commands

| Command           | Alias     | Function                                         |
| :---------------- | :-------- | :----------------------------------------------- |
| connectors        | -c        | view existing connectors and their status        |
| connectors new    | -c new    | create a new connection to an existing data sink |
| connectors delete | -c delete | delete an existing connection                    |

---

#### Topic Commands

| Command     | Alias   | Function                                                     |
| :---------- | :------ | :----------------------------------------------------------- |
| topics      | -t      | view a list of the current topics                            |
| topics show | -t show | view the event stream from an existing topic |

##### Notes

- `topics show` - use `CTRL+C` to exit

---

[View the QuickStart guide](https://github.com/venice-framework/venice/blob/master/README.md)
