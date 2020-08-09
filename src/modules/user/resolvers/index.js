const User = require("../../../models/User");
const { getUserId } = require("../../../middlewares/auth");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = {
  Query: {
    User: async (parent, args) => await User.findById(parent.id),
    users: async (_, __, context) => {
      try {
        const userId = getUserId(context);
        const users = await User.aggregate([
          {
            $match: {
              _id: {
                $ne: ObjectId(userId),
              },
            },
          },
          {
            $lookup: {
              from: "friends",
              let: {
                userId: ObjectId(userId),
                personId: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        $expr: {
                          $in: ["$requester", ["$$userId", "$$personId"]],
                        }
                      },
                      {
                        $expr: {
                          $in: ["$recipient", ["$$userId", "$$personId"]],
                        }
                      },
                    ],
                  },
                }
              ],
              as: "friendship",
            },
          },
          {
            $unwind: {
              path: "$friendship",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
        console.log(users);
        return users;
      } catch (error) {
        console.log(error);
      }
    },
    profile: async (_, __, context) => {
      const userId = getUserId(context);
      return await User.findById(userId);
    }
  },
};
