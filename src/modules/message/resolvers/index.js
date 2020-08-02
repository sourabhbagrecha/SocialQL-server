const { getUserId } = require("../../../middlewares/auth");
const Message = require("../../../models/Message");
const Friend = require("../../../models/Friend");

module.exports = {
  Query: {
    chat: async (root, args, context) => {
      const { user } = args;
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
      const messages = await Message.find(
        { friend: friend._id },
        { body: 1, user: 1, createdAt: 1 }
      ).lean();
      return messages;
    },
  },
  Mutation: {
    sendMessage: async (root, args, context) => {
      const { body, user } = args;
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
      console.log(message);
      return `Message sent successfully with id ${message._id}`;
    },
  },
};
