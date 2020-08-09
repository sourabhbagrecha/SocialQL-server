const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    chat(user: ID!): [Message!]
  }
  extend type Mutation {
    sendMessage(body: String!, user: ID!, token: ID!): MessageAck
  }
  extend type Subscription {
    messageAdded(friend: ID!): Message!
  }
  type MessageAck {
    token: ID!
    message: Message!
  }
  type Message {
    _id: ID!
    user: ID!
    body: String!
    createdAt: String!
  }
`;
