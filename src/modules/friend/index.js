const schema = require("./schema");
const resolvers = require("./resolvers");
const UserModule = require("../user");
const { GraphQLModule } = require("@graphql-modules/core");

module.exports = new GraphQLModule({
  typeDefs: schema,
  resolvers: resolvers,
  imports: [UserModule],
  context: rootContext => rootContext,
});
