const jwt = require("jsonwebtoken");
const AUTH_SECRET = "Learning Subscription";

const getUserId = (context) => {
  const token = context.req.get("Authorization").replace("Bearer ", "");
  if (token) {
    const { userId } = jwt.verify(token, AUTH_SECRET);
    return userId;
  }
  throw new Error("Not Authenticated!");
};

module.exports = {
  AUTH_SECRET,
  getUserId,
};
