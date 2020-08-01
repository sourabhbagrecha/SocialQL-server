const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    chat(friend: ID!): [Message!]
  }
  type Mutation {
    sendMessage(body: String!, friend: String!): String!
  }
  type Message {
    _id: ID!
    user: ID!
    body: String!
    createdAt: String!
  }
`;