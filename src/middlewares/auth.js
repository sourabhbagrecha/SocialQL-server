const jwt = require("jsonwebtoken");
const AUTH_SECRET = "Learning Subscription";

const getUserId = (context) => {
  const Authorization = context.req.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "")
    const { userId } = jwt.verify(token, AUTH_SECRET);
    return userId;
  }
  throw new Error("Not Authenticated!");
};

module.exports = {
  AUTH_SECRET,
  getUserId,
};
