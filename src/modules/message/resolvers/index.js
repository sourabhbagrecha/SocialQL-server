const { getUserId } = require("../../../middlewares/auth");
const Message = require("../../../models/Message");
const Friend = require("../../../models/Friend");

module.exports = {
  Query: {
    chat: async (root, args, context) => {
      const { friend } = args;
      const user = getUserId(context);
      const isAuthorized = await Friend.findOne({
        _id: friend,
        status: 2,
        $or: [{ requester: user }, { recipient: user }],
      }).lean();
      if (!isAuthorized) throw new Error("Unauthorized");
      const messages = await Message.find({ friend }, { body: 1, user: 1, createdAt: 1 }).lean();
      return messages;
    }
  },
  Mutation: {
    sendMessage: async (root, args, context) => {
      const { body, friend } = args;
      const user = getUserId(context);
      const isAuthorized = await Friend.findOne({
        _id: friend,
        status: 2,
        $or: [{ requester: user }, { recipient: user }],
      }).lean();
      console.log({ isAuthorized, user });
      if (!isAuthorized) throw new Error("Unauthorized");
      const message = await Message.create({
        body,
        friend,
        user,
      });
      console.log(message);
      return `Message sent successfully with id ${message._id}`;
    },
  },
};
