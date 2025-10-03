import { Privategroup } from "../models/privategroup.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const generateInvitationCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude confusing letters
  let code = "FAM-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};
// ========== CREATE GROUP ==========
const createPrivateGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const inviteCode =generateInvitationCode() 
  if (!name ) {
    throw new ApiError(400, "Group name  are required");
  }

  const newGroup = await Privategroup.create({
    name,
    description,
    inviteCode,
    createdBy: req.user.user_id,
    members: [
      {
        user: req.user.user_id,
        role: "owner"
      }
    ]
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newGroup, "Private group created successfully"));
});


// ========== JOIN GROUP ==========
const joinPrivateGroup = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;
  if (!inviteCode) throw new ApiError(400, "Invite code is required");

  const group = await Privategroup.findOne({ inviteCode });
  if (!group) throw new ApiError(404, "Group not found");

  // check if user already in group
  const alreadyMember = group.members.some(
    (m) => m.user_id === req.user.user_id
  );
  if (alreadyMember) throw new ApiError(400, "Already a member of this group");

  group.members.push({
    user_id: req.user.user_id,
    role: "member"
  });
  await group.save();

  return res.json(
    new ApiResponse(200, group, "Joined private group successfully")
  );
});

// ========== GET USER GROUPS ==========
const getMyPrivateGroups = asyncHandler(async (req, res) => {
  const groups = await Privategroup.find({ "members.user_id": req.user.user_id })

  return res.json(
    new ApiResponse(200, groups, "Fetched your private groups successfully")
  );
});

// ========== ADD STORY TO GROUP ==========
const addGroupStory = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { type, text, url, mimeType, size } = req.body;

  if (!type) throw new ApiError(400, "Story type is required");

  const group = await Privategroup.findOne({ groupId });
  if (!group) throw new ApiError(404, "Group not found");

  // check if user is member
  const isMember = group.members.some(
    (m) => m.user_id === req.user.user_id
  );
  if (!isMember) throw new ApiError(403, "You are not a member of this group");

  group.story.push({
    type,
    text,
    url,
    mimeType,
    size,
    createdBy: req.user.user_id
  });
  await group.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      group.story[group.story.length - 1],
      "Story added successfully"
    )
  );
});

// ========== GET GROUP DETAILS ==========
const getGroupDetails = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Privategroup.findOne({ groupId })

  if (!group) throw new ApiError(404, "Group not found");

  return res.status(200).json(new ApiResponse(200, group, "Group details fetched"));
});

// ========== REMOVE MEMBER (owner only) ==========
const removeMember = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const {memberId} =req.body;
  const group = await Privategroup.findOne({ groupId });
  if (!group) throw new ApiError(404, "Group not found");

  // check if current user is owner
  const owner = group.members.find(
    (m) =>
      m.user_id === req.user.user_id && m.role === "owner"
  );
  if (!owner) throw new ApiError(403, "Only owner can remove members");

  group.members = group.members.filter(
    (m) => m.user_id !== memberId
  );
  await group.save();

  return res.status(200).json(new ApiResponse(200, group, "Member removed successfully"));
});
// ========== DELETE GROUP (owner only) ==========
const deletePrivateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Privategroup.findOne({ groupId });
  if (!group) throw new ApiError(404, "Group not found");

  // check if current user is owner
  const owner = group.members.find(
    (m) => m.user_id === req.user.user_id && m.role === "owner"
  );
  if (!owner) throw new ApiError(403, "Only owner can delete the group");

  await group.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Group deleted successfully"));
});


// ========== UPDATE GROUP DETAILS ==========
const updatePrivateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name, description } = req.body;

  const group = await Privategroup.findOne({ groupId });
  if (!group) throw new ApiError(404, "Group not found");

  // check if current user is owner
  const owner = group.members.find(
    (m) => m.user_id === req.user.user_id && m.role === "owner"
  );
  if (!owner) throw new ApiError(403, "Only owner can update group details");

  if (name) group.name = name;
  if (description) group.description = description;

  await group.save();

  return res.status(200).json(new ApiResponse(200, group, "Group updated successfully"));
});


// ========== LEAVE GROUP ==========
const leavePrivateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Privategroup.findOne({ groupId });
  if (!group) throw new ApiError(404, "Group not found");

  // check if user is a member
  const memberIndex = group.members.findIndex(
    (m) => m.user_id === req.user.user_id
  );
  if (memberIndex === -1) throw new ApiError(400, "You are not a member of this group");

  // prevent owner from leaving (they must delete or transfer ownership)
  if (group.members[memberIndex].role === "owner") {
    throw new ApiError(400, "Owner cannot leave the group. Delete or transfer ownership instead.");
  }

  group.members.splice(memberIndex, 1);
  await group.save();

  return res.status(200).json(new ApiResponse(200, {}, "You left the group successfully"));
});

export {
  createPrivateGroup,
  joinPrivateGroup,
  getMyPrivateGroups,
  addGroupStory,
  getGroupDetails,
  removeMember,
  deletePrivateGroup,
  updatePrivateGroup,
  leavePrivateGroup
};
