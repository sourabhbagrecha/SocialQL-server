const UserModule = require("./user");
const AuthModule = require("./authentication");
const FriendModule = require("./friend");
const MessageModule = require("./message");
const PostModule = require("./post");

module.exports = [
  UserModule,
  AuthModule,
  FriendModule,
  MessageModule,
  PostModule,
];
