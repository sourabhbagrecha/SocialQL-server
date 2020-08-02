const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

module.exports = (request) => ({
  ...request,
  pubsub,
});
