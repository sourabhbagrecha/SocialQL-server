const postSchema = require("./schema");
const resolvers = require("./resolvers");

module.exports = {
  typeDefs: postSchema,
  resolvers,
};
