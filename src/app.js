const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");

const modules = require("./modules");
const context = require("./utils/contextConfig");
const subscriptions = require("./utils/subscriptionConfig");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongodb://localhost:27017/whatsapp-grahql";

const server = new ApolloServer({
  modules,
  context,
  subscriptions,
});

app.post("/", (req, res, next) => {
  const {query, body} = req;
  res.json({ok: true})
})

server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((_) => {
    console.log("DB Connected!");
    httpServer.listen(PORT, () => {
      console.log(`Listening on ${PORT}!`);
    });
  })
  .catch((err) => console.log(err));
