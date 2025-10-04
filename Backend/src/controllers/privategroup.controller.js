import { Privategroup } from "../models/privategroup.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

  if (!name || !name.trim()) {
    throw new ApiError(400, "Group name is required");
  }

  // Ensure unique inviteCode (retries if collision happens)
  let inviteCode, exists;
  do {
    inviteCode = generateInvitationCode();
    exists = await Privategroup.findOne({ inviteCode });
  } while (exists);

  // Create group
  const newGroup = await Privategroup.create({
    name: name.trim(),
    description: description?.trim() || "",
    inviteCode,
    createdBy: req.user.user_id,
    members: [
      {
        user_id: req.user.user_id, // ✅ correct field
        role: "owner"
      }
    ]
  });

  return res.status(201).json(
    new ApiResponse(201, newGroup, "✅ Private group created successfully")
  );
});


// ========== JOIN GROUP ==========
const joinPrivateGroup = asyncHandler(async (req, res) => {
  let { inviteCode } = req.body;

  if (!inviteCode || !inviteCode.trim()) {
    throw new ApiError(400, "Invite code is required");
  }

  inviteCode = inviteCode.trim().toUpperCase(); // normalize if codes are uppercase

  // Find group
  const group = await Privategroup.findOne({ inviteCode });
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  // Check if user already in group
  const alreadyMember = group.members.some(
    (m) => m.user_id.toString() === req.user.user_id.toString()
  );
  if (alreadyMember) {
    throw new ApiError(400, "Already a member of this group");
  }

  // Add member
  group.members.push({
    user_id: req.user.user_id,
    role: "member",
    joinedAt: new Date()
  });

  await group.save();

  // Optionally filter out sensitive/internal fields
  const groupData = group.toObject();
  delete groupData.__v;

  return res.status(200).json(
    new ApiResponse(200, groupData, "✅ Joined private group successfully")
  );
});


// ========== GET USER GROUPS ==========
const getMyPrivateGroups = asyncHandler(async (req, res) => {
  const groups = await Privategroup.find(
    { "members.user_id": req.user.user_id },
    {
      __v: 0, // exclude internal field
      "members._id": 0 // don't leak member subdoc ids
    }
  )
    .sort({ updatedAt: -1 }) // show most recently active groups first
    .lean(); // return plain JS objects (faster than Mongoose docs)

  if (!groups || groups.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "You are not in any private groups yet"));
  }

  return res.status(200).json(
    new ApiResponse(200, groups, "✅ Fetched your private groups successfully")
  );
});


// ========== ADD STORY TO GROUP ==========
const addGroupStory = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { contentType, text } = req.body;
  const file = req.file;

  if (!contentType) throw new ApiError(400, "Story contentType is required");

  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // check membership
  const isMember = group.members.some(
    (m) => m.user_id.toString() === req.user.user_id.toString()
  );
  if (!isMember) throw new ApiError(403, "You are not a member of this group");

  let newStory;

  // ====== CASE 1: TEXT STORY ======
  if (contentType === "text") {
    if (!text) throw new ApiError(400, "Text content is required for text story");

    newStory = {
      contentType,
      text,
      createdBy: Number(req.user.user_id)
    };
  }

  // ====== CASE 2: MEDIA STORY (image, video, audio, file) ======
  else {
    if (!file) throw new ApiError(400, `${contentType} file is required`);

    

    let resourceType = "auto";
    if (contentType === "image") resourceType = "image";
    if (contentType === "video") resourceType = "video";
    if (contentType === "audio") resourceType = "audio";

    const uploadResponse = await uploadOnCloudinary(file.path, resourceType);

    newStory = {
      contentType,
      url: uploadResponse.secure_url,
      mimeType: file.mimetype,
      size: file.size,
      text: text || "", // optional caption
      createdBy: Number(req.user.user_id)
    };
  }

  group.story.push(newStory);
  await group.save();

  return res.status(201).json(
    new ApiResponse(201, newStory, "Story added successfully")
  );
});


// ========== REMOVE STORY FROM GROUP ==========
const removeGroupStory = asyncHandler(async (req, res) => {
  const { groupId, storyId } = req.params;

  // Find group
  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // Find the story
  const story = group.story.id(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  // Check if current user is either story owner or group owner
  const isOwner = group.createdBy.toString()===req.user.user_id.toString();
  const isStoryCreator = story.createdBy.toString() === req.user.user_id.toString();

  if (!isOwner && !isStoryCreator) {
    throw new ApiError(403, "You are not authorized to delete this story");
  }

  // Remove the story
  group.story = group.story.filter((s) => s._id.toString() !== storyId);
  await group.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "✅ Story removed successfully"));
});


// ========== GET GROUP DETAILS ==========
const getGroupDetails = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Privategroup.findById(groupId)
  .select("name description inviteCode members story createdBy")
  .lean();

  if (!group) throw new ApiError(404, "Group not found");

  return res.status(200).json(new ApiResponse(200, group, "Group details fetched"));
});

// ========== REMOVE MEMBER (owner only) ==========
const removeMember = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { memberId } = req.body;

  if (!memberId) throw new ApiError(400, "memberId is required");

  // find group by ID
  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // check if current user is owner
  const isOwner =  group.createdBy.toString() === req.user.user_id.toString();
  if (!isOwner) throw new ApiError(403, "Only owner can remove members");

  // check if target member exists
  const targetMember = group.members.find((m) => m.user_id.toString() === memberId.toString());
  if (!targetMember) throw new ApiError(404, "Member not found in this group");

  // prevent removing owner(s)
  if (targetMember.role === "owner") {
    throw new ApiError(400, "Owner cannot be removed from the group");
  }

  // remove member
  group.members = group.members.filter((m) => m.user_id.toString() !== memberId.toString());
  await group.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { members: group.members }, // return only updated members
      "Member removed successfully"
    )
  );
});

// ========== DELETE GROUP (owner only) ==========
const deletePrivateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Find group by MongoDB _id
  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // Check if current user is owner
  const owner = group.createdBy.toString()===req.user.user_id.toString();
  if (!owner) throw new ApiError(403, "Only the owner can delete this group");

  await group.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group deleted successfully"));
});



// ========== UPDATE GROUP DETAILS ==========
const updatePrivateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name, description } = req.body;

  // Find group by _id
  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // Check if current user is owner
  const owner = group.createdBy.toString() === req.user.user_id.toString();
  if (!owner) throw new ApiError(403, "Only the owner can update group details");

  // Update fields only if provided
  if (name?.trim()) group.name = name.trim();
  if (description?.trim()) group.description = description.trim();

  await group.save();

  return res
    .status(200)
    .json(new ApiResponse(200, group, "Group updated successfully"));
});



// ========== LEAVE GROUP ==========
const leavePrivateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // check if user is a member
  const memberIndex = group.members.findIndex(
    (m) => m.user_id.toString() === req.user.user_id.toString()
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

const getGroupStories = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // find group (only fetch stories + members)
  const group = await Privategroup.findById(groupId)
    .select("story members")
    .lean();

  if (!group) throw new ApiError(404, "Group not found");

  // check membership
  const isMember = group.members.some(
    (m) => m.user_id.toString() === req.user.user_id.toString()
  );
  if (!isMember) throw new ApiError(403, "You are not a member of this group");

  // sort stories by createdAt (descending)
  let stories = group.story
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // (optional) filter out expired stories if expiresAt is used
  // stories = stories.filter(st => !st.expiresAt || new Date(st.expiresAt) > Date.now());

  // pagination
  const totalStories = stories.length;
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedStories = stories.slice(start, end);

  return res.status(200).json(
    new ApiResponse(200, {
      stories: paginatedStories,
      pagination: {
        total: totalStories,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalStories / limit)
      }
    }, "✅ Group stories fetched successfully")
  );
});

//---------------search private group-------

const searchPrivateGroups = asyncHandler(async (req, res) => {
  const { query } = req.body; // or req.query.search
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userId = parseInt(req.user.user_id); // Ensure the userId is defined and converted to a number (assuming it comes from req.user)

  if (!query || !query.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const trimmedQuery = query.trim();

  // Case-insensitive partial match on group name
  const filter = {
    "members.user_id": userId, // Correctly check for the user_id within the members array
    name: new RegExp(trimmedQuery, 'i') // Perform case-insensitive search on the name field using RegExp
  };

  const total = await Privategroup.countDocuments(filter);

  const groups = await Privategroup.find(filter)
    .select("name description inviteCode createdBy members") // exclude heavy fields if needed
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }) // most recently created first
    .lean();

  return res.status(200).json(
    new ApiResponse(200, {
      groups,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, "Groups fetched successfully")
  );
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
  leavePrivateGroup,
  getGroupStories,
  removeGroupStory,
  searchPrivateGroups
};
