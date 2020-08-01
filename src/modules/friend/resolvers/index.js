const Friend = require("../../../models/Friend");
const { getUserId } = require("../../../middlewares/auth");
const User = require("../../../models/User");

module.exports = {
  Query: {
    friends: async (root, args, context) => {
      const user = getUserId(context);
      const fetchFriends = await Friend.find({ $or: [{ requester: user }, { recipient: user }] }).lean();
      const friendsList = fetchFriends.map(friend => (friend.requester.toString() === user) ? friend.recipient : friend.requester)
      const users = await User.find({ _id: { $in: friendsList } });
      console.log({ users });
      return users;
    }
  },
  Mutation: {
    friendRequest: async (root, args, context) => {
      const { userId } = args;
      const currentUser = getUserId(context);
      const users = [userId, currentUser];
      const friend = await Friend.findOne({
        $and: [{ requester: { $in: users } }, { recipient: { $in: users } }],
      });
      console.log({ friend });
      if (friend) throw new Error("Friendship already requested!");
      const newFriend = await Friend.create({
        requester: currentUser,
        recipient: userId,
        status: 1,
      });
      console.log({ newFriend });
      return "Friend Request sent successfully!";
    },
    friendAccept: async (root, args, context) => {
      const { userId } = args;
      const currentUser = getUserId(context);
      const users = [userId, currentUser];
      const friend = await Friend.findOne({
        $and: [{ requester: { $in: users } }, { recipient: { $in: users } }, { status: 1}],
      });
      if (!friend) throw new Error("No request to accept");
      friend.status = 2;
      const accepted = await friend.save();
      console.log({ accepted });
      return "Friend Request accepted successfully!";
    },
  },
};
