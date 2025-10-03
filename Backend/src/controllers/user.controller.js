// controllers/user.controller.js
const { User, Family, Membership } = require("../models");
const Story = require("../models/story.model.js"); // MongoDB
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary , deleteImageOnCloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




// Google login controller

export const loginWithGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) throw new ApiError(400, 'ID token is required');

  // Verify Google ID token
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email } = ticket.getPayload();

  // Check if user already exists in your DB
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // If user not found, do NOT register automatically
    return res.status(401).json(new ApiResponse(401, {}, 'You need to sign in first'));
  }

  // User exists → generate JWT tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.update({ refreshToken });

  return res.json(new ApiResponse(200, { user, accessToken, refreshToken }, 'Google login successful'));
});




// ========== REGISTER USER ==========
export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, dob, gender, email, phone_no, password } = req.body;

  if (!fullname || !username || !dob || !gender || !email || !phone_no || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check uniqueness
  const existingUser = await User.findOne({
    where: { 
      [User.sequelize.Op.or]: [{ email }, { username }, { phone_no }]
    }
  });
  if (existingUser) throw new ApiError(400, "User already exists with this email/username/phone");

  // Profile photo upload
  let profilePhotoUrl = null;
  if (req.file?.path) {
    const uploadRes = await uploadOnCloudinary(req.file.path, "image");
    profilePhotoUrl = uploadRes.secure_url;
  }

  const user = await User.create({
    fullname,
    username,
    dob,
    gender,
    email,
    phone_no,
    passwordHash: password,
    profilePhoto: profilePhotoUrl,
    refreshToken: ""
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.update({ refreshToken });

  return res.status(201).json(new ApiResponse(201, { user, accessToken, refreshToken }, "User registered successfully"));
});


// ========== LOGIN USER ==========


// make sure  frontend sends "identifier" (username/email/phone) instead of loginID ...
export const loginUser = asyncHandler(async (req, res) => {
  
  const { identifier, password } = req.body; // identifier = username/email/phone

  if (!identifier || !password) throw new ApiError(400, "All fields are required");

  const user = await User.findOne({
    where: {
      [User.sequelize.Op.or]: [
        { email: identifier },
        { username: identifier },
        { phone_no: identifier }
      ]
    }
  });

  if (!user) throw new ApiError(401, "Invalid credentials");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.update({ refreshToken });

  return res.json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});


// ========== LOGOUT ==========
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.user_id);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = "";
  await user.save();

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});


// ========== REFRESH TOKEN ==========
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.user_id);

    if (!user) throw new ApiError(401, "Invalid token");
    if (incomingRefreshToken !== user.refreshToken ) throw new ApiError(403, "Refresh token expired or used");

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    throw new ApiError(401, err.message || "Invalid refresh token");
  }
});



// ========== CURRENT USER ==========
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200, req.user, "Current user fetched"));
});


// ========== CHANGE PASSWORD ==========
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) throw new ApiError(400, "Both passwords required");

  const isValid = await req.user.isPasswordCorrect(oldPassword);
  if (!isValid) throw new ApiError(401, "Old password incorrect");

  req.user.passwordHash = newPassword;
  await req.user.save();

  return res.json(new ApiResponse(200, {}, "Password updated successfully"));
});


// ========== UPDATE PROFILE PHOTO ==========
export const updateUserProfileImage = asyncHandler(async (req, res) => {
  if (!req.file?.path) throw new ApiError(400, "Profile image required");

 if (req.user.profilePhoto) {
  await deleteImageOnCloudinary(req.user.profilePhoto);
}
const uploadRes = await uploadOnCloudinary(req.file.path, "image");
await req.user.update({ profilePhoto: uploadRes.secure_url });


  return res.json(new ApiResponse(200, req.user, "Profile photo updated"));
});


// ========== GET USER PROFILE ==========
export const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByPk(userId, { attributes: { exclude: ["passwordHash", "refreshToken"] } });
  if (!user) throw new ApiError(404, "User not found");

  const families = await user.getFamilies();
  return res.json(new ApiResponse(200, { user, families }, "User profile fetched"));
});


// ========== UPDATE ACCOUNT DETAILS ==========
export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, username, gender, dob } = req.body;

  // Only pick fields that are not undefined
  const updates = {};
  if (fullname !== undefined) updates.fullname = fullname;
  if (username !== undefined) updates.username = username;
  if (gender !== undefined) updates.gender = gender;
  if (dob !== undefined) updates.dob = dob;

  await req.user.update(updates);

  // remove sensitive fields (like password)
  const userData = req.user.toJSON();
  delete userData.password;

  return res.json(new ApiResponse(200, userData, "Account details updated"));
});

// user timeline content.controller.js