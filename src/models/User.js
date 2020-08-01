const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userScehma = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userScehma);
