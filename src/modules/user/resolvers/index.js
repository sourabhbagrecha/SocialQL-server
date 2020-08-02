const User = require("../../../models/User");

module.exports = {
  User: async (parent, args) => {
    console.log({ parent, args });
    return await User.findById(parent.id);
  },
};
