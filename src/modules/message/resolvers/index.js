const { getUserId } = require("../../../middlewares/auth");
const Message = require("../../../models/Message");
const Friend = require("../../../models/Friend");
const { withFilter } = require("apollo-server-express");
const MESSAGE_ADDED = "MESSAGE_ADDED";

module.exports = {
  Query: {
    chat: async (root, args, context) => {
      const { friend } = args;
      const currentUser = getUserId(context);
      const friendFound = await Friend.findById(friend, { _id: 1 }).lean();
      if (!friendFound) throw new Error("Unauthorized");
      const messages = await Message.find(
        { friend: friendFound._id },
        { body: 1, user: 1, createdAt: 1 }
      ).lean();
      return messages;
    },
  },
  Mutation: {
    sendMessage: async (root, { body, user, token }, context) => {
      const { pubsub } = context;
      const currentUser = getUserId(context);
      const friend = await Friend.findOne({
        status: 2,
        $and: [
          {
            $or: [{ requester: user }, { recipient: user }],
          },
          {
            $or: [{ requester: currentUser }, { recipient: currentUser }],
          },
        ],
      }).lean();
      if (!friend) throw new Error("Unauthorized");
      const message = await Message.create({
        body,
        friend: friend._id,
        user: currentUser,
      });
      pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
      return {
        token,
        message,
      };
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator([MESSAGE_ADDED]),
        (payload, variables) =>
          payload.messageAdded.friend.toString() === variables.friend
      ),
    },
  },
};
