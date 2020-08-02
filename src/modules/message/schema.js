const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    chat(user: ID!): [Message!]
  }
  type Mutation {
    sendMessage(body: String!, user: String!): String!
  }
  type Message {
    _id: ID!
    user: ID!
    body: String!
    createdAt: String!
  }
`;