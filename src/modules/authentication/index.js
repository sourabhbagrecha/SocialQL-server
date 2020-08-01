const authSchema = require("./schema");
const resolvers = require("./resolvers");
const { GraphQLModule } = require("@graphql-modules/core");

module.exports = new GraphQLModule({
  typeDefs: authSchema,
  resolvers,
});
