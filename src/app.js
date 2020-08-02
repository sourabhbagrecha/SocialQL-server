const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, PubSub } = require("apollo-server-express");
const UserModule = require("./modules/user");
const AuthModule = require("./modules/authentication");
const FriendModule = require("./modules/friend");
const MessageModule = require("./modules/message");

const app = express();
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  modules: [UserModule, AuthModule, FriendModule, MessageModule],
  context: (request) => request,
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
