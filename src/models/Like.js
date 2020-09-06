const mongoose = require("mongoose");
const {
  Schema,
  model,
  Types: { ObjectId },
} = mongoose;

const likeSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  post: {
    type: ObjectId,
    required: true,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Like", likeSchema);
