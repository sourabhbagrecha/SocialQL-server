const authSchema = require("./schema");
const resolvers = require("./resolvers");

module.exports = ({
  typeDefs: authSchema,
  resolvers,
});
