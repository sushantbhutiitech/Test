const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, "bhumi_community");
      const user = await User.findById(decoded.sub);
      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid/Expired token");
    }
  }
  return null;
};

module.exports = authenticate;
