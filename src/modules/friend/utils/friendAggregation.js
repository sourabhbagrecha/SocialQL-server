const {
  Types: { ObjectId },
} = require("mongoose");

const User = require("../../../models/User");
const Friend = require("../../../models/Friend");

const getFriendRequestsUsers = async (
  currentUser,
  page = 0,
  mode = "received"
) => {
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

const findFriendsWithMetaUser = async (currentUser) => {
  try {
    const friends = await Friend.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $or: [
                  { $eq: ["$requester", ObjectId(currentUser)] },
                  { $eq: ["$recipient", ObjectId(currentUser)] },
                ],
              },
              { $eq: ["$status", 2] },
            ],
          },
        },
      },
      {
        $project: {
          user: {
            $cond: [
              { $eq: ["$requester", ObjectId(currentUser)] },
              "$recipient",
              "$requester",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            user: "$user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$user", "$_id"],
                },
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          user: 1,
        },
      },
    ]);
    return friends;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findFriendSuggestions = async (currentUser) => {
  try {
    const suggestions = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: ObjectId(currentUser),
          },
        },
      },
      {
        $lookup: {
          from: "friends",
          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$requester", ObjectId(currentUser)] },
                            { $eq: ["$recipient", "$$userId"] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$recipient", ObjectId(currentUser)] },
                            { $eq: ["$requester", "$$userId"] },
                          ],
                        },
                      ],
                    },
                    {
                      $ne: ["$status", 0],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: "friend",
        },
      },
      {
        $unwind: {
          path: "$friend",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          friend: null,
        },
      },
    ]);
    return suggestions;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getFriendRequestsUsers,
  findFriendsWithMetaUser,
  findFriendSuggestions,
};
