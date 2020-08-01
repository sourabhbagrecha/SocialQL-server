const { gql } = require("apollo-server-express");

module.exports = gql`
type AuthPayload {
  token: String!
  userId: String!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  signup(email: String!, password: String!, name: String!): AuthPayload!
}
`;
