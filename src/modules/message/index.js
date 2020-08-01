const schema = require("./schema");
const resolvers = require("./resolvers");
const { GraphQLModule } = require("@graphql-modules/core");

module.exports = new GraphQLModule({
  typeDefs: schema,
  resolvers,
  context: rootContext => rootContext,
});
