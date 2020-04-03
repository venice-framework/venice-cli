// const schemaLogic = args => {
//   if (args.new) {
//     newConnector();
//   } else {
//     showSchemas();
//   }
// };

// I haven't tested this as the schema-registry isn't available on local host
const getSchemas = () => {
  fetch(SCHEMA_URL)
    .then(res => res.json())
    .then(json => log(json))
    .catch(err => log(err));
};

module.exports = getSchemas;
