const { log, error, fetch, divider, config } = require("../utils");
// const SCHEMA_URL = "http://schema-registry:8081/subjects";
const SCHEMA_URL = `${config.SCHEMA_REGISTRY_URL}/subjects`;
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
      .catch(err => error(err));
  },

  printSchemas: async () => {
    try {
      const schemas = await SCHEMAS.getSchemas();

      if (schemas.length === 0) {
        log("There are no schemas currently ");
        return;
      }

      log(`There are ${schemas.length} schemas:`);
      divider();
      schemas.forEach(log);
    } catch (err) {
      error(err);
      divider();
      error(
        "Please make sure the Schema Registry is available. This error can occur if you've just launched the pipeline and the containers aren't ready to recieve this request."
      );
    }
  }
};

module.exports = SCHEMAS;
