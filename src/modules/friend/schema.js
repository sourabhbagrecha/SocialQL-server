const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    friends: [User!]!
  }
  type Mutation {
    friendRequest(userId: ID!): String!
    friendAccept(userId: ID!): String!
  }
`;
