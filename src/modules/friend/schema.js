const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    friends: [Friend!]!
    friendSuggestions: [User!]!
    requestsSent: [User!]!
    requestsReceived: [User!]!
  }
  extend type Mutation {
    friendRequest(userId: ID!): String!
    friendAccept(userId: ID!): String!
  }
  type Friend {
    user: User!
    _id: ID!
  }
`;
