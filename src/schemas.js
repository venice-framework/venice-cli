const { log, error, fetch, divider } = require("../utils");
// const SCHEMA_URL = "http://schema-registry:8081/subjects";
const SCHEMA_URL = "http://localhost:8081/subjects";

const validSchemaCommands = `
  "venice schemas": prints all the current schemas

  "venice -s" is an alias for "venice schemas"
`;

const SCHEMAS = {
  parseSchemaCommand: command => {
    switch (command) {
      case false:
        SCHEMAS.printSchemas();
        break;

      default:
        error(
          `"${command}" is not a valid schema command. The list of valid commands are:

          ${validSchemaCommands}`
        );
        break;
    }
  },

  getSchemas: async () => {
    return await fetch(SCHEMA_URL)
      .then(res => res.json())
      .catch(err => log(err));
  },

  printSchemas: async () => {
    const schemas = await SCHEMAS.getSchemas();

    if (schemas.length === 0) {
      log("There are no schemas currently ");
      return;
    }

    log(`There are ${schemas.length} schemas:`);
    divider();
    schemas.forEach(log);
  }
};

// I haven't tested this as the schema-registry isn't available on local host
const getSchemas = () => {
  return fetch(SCHEMA_URL)
    .then(res => res.json())
    .catch(err => log(err));
};

module.exports = SCHEMAS;
