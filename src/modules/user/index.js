const userSchema = require("./schema");
const resolvers = require("./resolvers");

module.exports = ({
  typeDefs: userSchema,
  resolvers,
})