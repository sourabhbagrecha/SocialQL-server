const { gql } = require("apollo-server-express");

module.exports = gql`
extend type Query {
  user(_id: ID!): User!
}

type User {
  _id: ID!
  name: String!
  email: String!
}`;