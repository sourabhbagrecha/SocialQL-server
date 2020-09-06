const mongoose = require("mongoose");
const { postTypes } = require("../constants");
const { Schema, Types, model } = mongoose;

const { sourceTypes } = require("../constants");

const sourceSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [sourceTypes.IMAGE, sourceTypes.VIDEO]
  },
  url: {
    type: String,
    required: true
  },
})

const postSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User"
    },
    sources: {
      type: [sourceSchema],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);