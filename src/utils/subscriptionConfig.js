const jwt = require("jsonwebtoken");
const { AUTH_SECRET } = require("../middlewares/auth");

module.exports = {
  onConnect: (connectionParams, webSocket) => {
    const { Authorization } = connectionParams;
    if (Authorization) {
      const token = Authorization.replace("Bearer ", "");
      return () => {
        const { userId } = jwt.verify(token, AUTH_SECRET);
        return {
          currentUser: userId,
        };
      };
    }
    throw new Error("Missing auth token!");
  },
};
