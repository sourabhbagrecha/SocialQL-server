const bcrypt = require("bcryptjs");
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const { AUTH_SECRET } = require("../../../middlewares/auth");

module.exports = {
  Mutation: {
    login: async (root, args, context, info) => {
      const { email, password } = args;
      const user = await User.findOne({ email }).lean();
      if (!user) throw new Error("No such user exists!");
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) throw new Error("Wrong password!");
      const token = jwt.sign({ userId: user._id }, AUTH_SECRET, {
        expiresIn: "12h",
      });
      return {
        userId: user._id,
        token,
      };
    },
    signup: async (root, args, context, info) => {
      const { email, password, name } = args;
      const user = await User.findOne({ email }).lean();
      if (user) throw new Error("User with that email already exists!");
      const hashedPw = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        name,
        email,
        password: hashedPw,
      });
      const token = jwt.sign({ userId: newUser._id }, AUTH_SECRET, {
        expiresIn: "12h",
      });
      return {
        userId: newUser._id,
        token,
      };
    },
  },
};
