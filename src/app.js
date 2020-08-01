const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const UserModule = require("./modules/user");
const AuthModule = require("./modules/authentication");
const FriendModule = require("./modules/friend");
const MessageModule = require("./modules/message");
const { GraphQLModule } = require("@graphql-modules/core");

const app = express();
const PORT = process.env.PORT || 5000;

const MyGraphqlModule = new GraphQLModule({
  imports: [UserModule, AuthModule, FriendModule, MessageModule],
  context: rootContext => rootContext,
});

const server = new ApolloServer({
  schema: MyGraphqlModule.schema,
  context: request => request,
});

server.applyMiddleware({ app });

mongoose
  .connect("mongodb://localhost:27017/whatsapp-grahql", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((_) => {
    console.log("connected!");
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}!`);
    });
  })
  .catch((err) => console.log(err));
