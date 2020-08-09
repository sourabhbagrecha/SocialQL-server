const Friend = require("../../../models/Friend");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = async (currentUser, page = 0, mode = "received") => {
  const getReceived = mode === "received";
  const matchQuery = {
    status: 1,
  };
  getReceived
    ? (matchQuery.recipient = ObjectId(currentUser))
    : (matchQuery.requester = ObjectId(currentUser));

  const requestedUsers = await Friend.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: "users",
        let: {
          userId: getReceived ? "$requester" : "$recipient",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$userId", "$_id"],
              },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        name: "$user.name",
        email: "$user.email",
        _id: "$user._id",
      },
    },
  ]);
  return requestedUsers;
};
