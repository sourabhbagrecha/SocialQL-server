const mongoose = require("mongoose");
const {
  Schema,
  model,
  Types: { ObjectId },
} = mongoose;

const messageSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      required: true,
    },
    friend: {
      type: ObjectId,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
