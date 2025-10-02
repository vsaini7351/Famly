const { User } = require("../models"); // make sure index.js exports User
const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized access");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  // Fetch user from PostgreSQL
  const user = await User.findByPk(decodedToken.user_id, {
    attributes: { exclude: ["passwordHash", "refreshToken"] }
  });

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  // Attach user to request
  req.user = user;

  next();
});

module.exports = verifyJWT;
