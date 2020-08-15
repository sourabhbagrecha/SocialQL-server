const schema = require("./schema");
const resolvers = require("./resolvers");
const UserModule = require("../user");

module.exports = ({
  typeDefs: schema,
  resolvers: resolvers,
});
