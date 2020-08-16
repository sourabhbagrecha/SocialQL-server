const Friend = require("../../../models/Friend");
const { getUserId } = require("../../../middlewares/auth");
const User = require("../../../models/User");
const util = require("util");
const {
  Types: { ObjectId },
} = require("mongoose");
const {
  getFriendRequestsUsers,
  findFriendsWithMetaUser,
  findFriendSuggestions,
} = require("../utils/friendAggregation");

module.exports = {
  Query: {
    friends: async (root, args, context) => {
      const currentUser = getUserId(context);
      return findFriendsWithMetaUser(currentUser);
    },
    friendSuggestions: async (root, args, context) => {
      const currentUser = getUserId(context);
      return findFriendSuggestions(currentUser);
    },
    requestsSent: async (_, __, context) => {
      const currentUser = getUserId(context);
      return getFriendRequestsUsers(currentUser, 0, "sent");
    },
    requestsReceived: async (_, __, context) => {
      const currentUser = getUserId(context);
      return getFriendRequestsUsers(currentUser, 0, "received");
    },
  },
  Mutation: {
    friendRequest: async (root, args, context) => {
      const { userId } = args;
      const currentUser = getUserId(context);
      const users = [userId, currentUser];
      const newFriendObject = {
        requester: currentUser,
        recipient: userId,
        status: 1,
      };

      const friendUser = await User.findById(userId, { name: 1 }).lean();
      if (!friendUser) throw new Error("No such user exists!");

      let friend = await Friend.findOne({
        $and: [{ requester: { $in: users } }, { recipient: { $in: users } }],
      });
      if (friend) {
        switch (friend.status) {
          case 0:
            await friend.update({ $set: newFriendObject });
            return `Friend request sent to ${friendUser.name}`;
          case 1:
            throw new Error("Friendship already requested!");
          case 2:
            throw new Error("Friendship already exists!");
          default:
            throw new Error("Server error");
        }
      } else {
        const newFriend = await Friend.create(newFriendObject);
        return `Friend request sent to ${friendUser.name}`;
      }
    },
    friendAccept: async (root, args, context) => {
      const { userId } = args;
      const currentUser = getUserId(context);
      const users = [userId, currentUser];

      const friendUser = await User.findById(userId, { name: 1 }).lean();
      if (!friendUser) throw new Error("No such user exists!");

      const friend = await Friend.findOne({
        $and: [
          { requester: { $in: users } },
          { recipient: { $in: users } },
          { status: 1 },
        ],
      });
      if (!friend) throw new Error("No request to accept");

      friend.status = 2;
      const accepted = await friend.save();

      return `Friend request by ${friendUser.name} accepted!`;
    },
    cancelFriendRequest: async (root, args, context) => {
      const { userId } = args;
      const currentUser = getUserId(context);
      const users = [userId, currentUser];

      const friendUser = await User.findById(userId, { name: 1 }).lean();
      if (!friendUser) throw new Error("No such user exists!");

      const friend = await Friend.findOne({
        $and: [
          { requester: { $in: users } },
          { recipient: { $in: users } },
          { status: 1 },
        ],
      });
      if (!friend) throw new Error("No request to cancel!");

      friend.status = 0;
      await friend.save();

      return `Friend request to ${friendUser.name} cancelled!`;
    },
  },
};
