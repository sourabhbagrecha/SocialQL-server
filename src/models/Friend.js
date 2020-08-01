const mongoose = require("mongoose");
const {
  Schema,
  model,
  Types: { ObjectId },
} = mongoose;

const friendSchema = new Schema(
  {
    requester: {
      type: ObjectId,
      ref: "User",
    },
    recipient: {
      type: ObjectId,
      ref: "User",
    },
    status: {
      type: Number,
      enum: [
        0, //Add friend
        1, //Requested
        2, //Friends
      ],
    },
  },
  { timestamps: true }
);

module.exports = model("Friend", friendSchema);
