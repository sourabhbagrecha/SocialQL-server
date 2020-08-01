const { gql } = require("apollo-server-express");

module.exports = gql`
type Query {
  user(_id: ID!): User
}

type User {
  _id: ID!
  name: String!
  email: String!
}`;