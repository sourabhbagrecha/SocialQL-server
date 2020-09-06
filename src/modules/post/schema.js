const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload

  extend type Query {
    feed: [Post!]
  }
  extend type Mutation {
    createPost(input: createPostPayload): Post!
    likePost(postId: ID!): String!
    singleUploadStream(file: Upload!, key: String!): UploadResponse!
  }
  type Post {
    _id: ID!
    caption: String!
    user: User!
    sources: [Source!]
  }
  type Source {
    _id: ID!
    type: String!
    url: String!
  }
  input createPostPayload {
    caption: String! 
    sources: [SourcePayload]
  }
  input SourcePayload {
    type: String!
    url: String!
  }
  type UploadResponse {
    url: String!
    key: String!
  }
`;
