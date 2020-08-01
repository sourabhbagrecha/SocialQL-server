const { GraphQLModule } = require("@graphql-modules/core");
const userSchema = require("./schema");
const resolvers = require("./resolvers");

module.exports = new GraphQLModule({
  typeDefs: userSchema,
  resolvers,
})