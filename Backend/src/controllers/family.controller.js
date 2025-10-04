import {User,Family,Membership} from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteImageOnCloudinary } from "../utils/cloudinary.js";
import { Op } from 'sequelize';

// Simple readable invitation code generator
const generateInvitationCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude confusing letters
  let code = "FAM-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const createFamily = asyncHandler(async (req, res) => {
  const { family_name, marriage_date, description } = req.body;

  // Get the user creating the family
  const user = await User.findByPk(Number(req.user.user._id));
  if (!user) throw new ApiError(404, "User not found");

  // Check if the user is already a root member in any family
  const existingRootFamily = await Family.findOne({
    where: {
      [Op.or]: [
        { male_root_member: user.user_id },
        { female_root_member: user.user_id },
      ],
    },
  });

  if (existingRootFamily) {
    throw new ApiError(400, "You are already a root member of another family and cannot create a new family");
  }

  // Determine root member based on user gender
  let male_root_member = null;
  let female_root_member = null;
  let ancestor = null;

  if (user.gender.toLowerCase() === "male") {
    male_root_member = user.user_id;
    ancestor = user.parent_family || null; // ancestor is male root member's parent family
  } else if (user.gender.toLowerCase() === "female") {
    female_root_member = user.user_id;
  } else {
    throw new ApiError(400, "User gender must be male or female");
  }

  // Upload familyPhoto if provided
  let familyPhotoUrl = null;
  if (req.file) {
    familyPhotoUrl = (await uploadOnCloudinary(req.file.path, "image")).secure_url;
  }

  // Generate invitation code
  const invitation_code = generateInvitationCode();

  // Create family
  const newFamily = await Family.create({
    family_name,
    marriage_date,
    description: description || null,
    familyPhoto: familyPhotoUrl,
    created_by: user.user_id,
    male_root_member,
    female_root_member,
    ancestor,
    invitation_code,
  });

   const rootMemberId = male_root_member || female_root_member;
  await Membership.create({
    family_id: newFamily.family_id,
    user_id: rootMemberId,
    role: "admin", // root member gets admin role
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newFamily, "Family created successfully"));
});

const getFamily = asyncHandler(async (req, res) => {
  const { familyId } = req.params;

  // Fetch family
  const family = await Family.findByPk(familyId, {
    include: [
      // Root members
      { model: User, as: "maleRoot", attributes: ["user_id", "fullname", "email", "gender", "profilePhoto"] },
      { model: User, as: "femaleRoot", attributes: ["user_id", "fullname", "email", "gender", "profilePhoto"] },

      // All memberships with user info
      {
        model: Membership,
        as: "memberships",
        include: [
          { model: User, as: "user", attributes: ["user_id", "fullname", "email", "gender", "profilePhoto"] },
        ],
      },
    ],
  });

  if (!family) throw new ApiError(404, "Family not found");

  return res
    .status(200)
    .json(new ApiResponse(200, family, "Family fetched successfully"));
});

const addMember = asyncHandler(async (req, res) => {
const family_id = Number(req.params.family_id);
const user_id = Number(req.body.user_id);


  if (!family_id || !user_id) {
    throw new ApiError(400, "family_id and user_id are required");
  }

  // Check if family exists
  const family = await Family.findByPk(family_id);
  if (!family) throw new ApiError(404, "Family not found");

  // Check if user exists
  const user = await User.findByPk(user_id);
  if (!user) throw new ApiError(404, "User not found");

   // Check if user already has a parent family
  if (user.parent_family !== null) {
    throw new ApiError(400, "User already belongs to another family and cannot be added");
  }

  // Check if user is already a member
  const existingMembership = await Membership.findOne({
    where: { family_id, user_id },
  });
  if (existingMembership) throw new ApiError(400, "User is already a member of this family");

  // Create membership
  const membership = await Membership.create({
    family_id,
    user_id,
    role: "member",
  });

   // Update user's parent_family
  user.parent_family = family_id;
  await user.save();

  // If user is male, check if he is a root member of any other family
  if (user.gender.toLowerCase() === "male") {
    const maleRootFamilies = await Family.findAll({
      where: { male_root_member: user.user_id },
    });

    // Update ancestor of those families to this family
    for (const f of maleRootFamilies) {
      f.ancestor = family_id;
      await f.save();
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(201, membership, "Member added successfully"));
});

const addRootMember = asyncHandler(async (req, res) => {
  const targetUserId = Number(req.body.user_id);
  if (!targetUserId) throw new ApiError(400, "user_id is required");

  // Get current user
  const currentUser = await User.findByPk(Number(req.user.user._id));
  if (!currentUser) throw new ApiError(404, "Current user not found");

  // Get target user
  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser) throw new ApiError(404, "Target user not found");

  // Check if target user is already a root member in another family
  const existingRootFamily = await Family.findOne({
    where: {
      [Op.or]: [
        { male_root_member: targetUser.user_id },
        { female_root_member: targetUser.user_id },
      ],
    },
  });
  if (existingRootFamily) {
    throw new ApiError(400, "This user is already a root member of another family");
  }

  // Fetch the family in which current user is already a root member
  const family = await Family.findOne({
    where: {
      [Op.or]: [
        { male_root_member: currentUser.user_id },
        { female_root_member: currentUser.user_id },
      ],
    },
  });
  if (!family) throw new ApiError(404, "You are not a root member of any family");

  // Determine which slot to fill for the target user
  let updateData = {};
  if (targetUser.gender.toLowerCase() === "male") {
    if (family.male_root_member) {
      throw new ApiError(400, "Male root member already exists and cannot be changed");
    }
    updateData.male_root_member = targetUser.user_id;
    updateData.ancestor = targetUser.parent_family || null; // ancestor logic
  } else if (targetUser.gender.toLowerCase() === "female") {
    if (family.female_root_member) {
      throw new ApiError(400, "Female root member already exists and cannot be changed");
    }
    updateData.female_root_member = targetUser.user_id;
  } else {
    throw new ApiError(400, "User gender must be male or female");
  }

  // Update family
  await family.update(updateData);

  // Create membership for target user
  await Membership.create({
    family_id: family.family_id,
    user_id: targetUser.user_id,
    role: "admin",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, family, "Root member added successfully"));
});

const updateFamily = asyncHandler(async (req, res) => {
  const family_id = Number(req.params.family_id); // family ID from route params
  const { family_name, marriage_date, description } = req.body;

  // Fetch family
  const family = await Family.findByPk(family_id);
  if (!family) throw new ApiError(404, "Family not found");

  // Check if the user is one of the root members
  const userId = Number(req.user.user._id);
  if (family.male_root_member !== userId && family.female_root_member !== userId) {
    throw new ApiError(403, "Only root members can update family details");
  }

  // Update basic fields if provided
  if (family_name) family.family_name = family_name;
  if (marriage_date) family.marriage_date = marriage_date;
  if (description) family.description = description;

  // Handle profile photo update
  if (req.file) {
    // Delete old photo from Cloudinary if exists
    if (family.familyPhoto) {
      await deleteImageOnCloudinary(family.familyPhoto);
    }

    // Upload new photo
    const uploadedPhoto = await uploadOnCloudinary(req.file.path, "image");
    family.familyPhoto = uploadedPhoto.secure_url;
  }

  // Save updates
  await family.save();

  return res
    .status(200)
    .json(new ApiResponse(200, family, "Family details updated successfully"));
});

const removeMember = asyncHandler(async (req, res) => {
const family_id = Number(req.params.family_id);
const user_id = Number(req.body.user_id);


  if (!family_id || !user_id) {
    throw new ApiError(400, "family_id and user_id are required");
  }

  // Fetch family
  const family = await Family.findByPk(family_id);
  if (!family) throw new ApiError(404, "Family not found");

  // Check if requester is a root member
  const currentUserId = Number(req.user.user._id);
  if (family.male_root_member !== currentUserId && family.female_root_member !== currentUserId) {
    throw new ApiError(403, "Only root members can remove members from this family");
  }

  // Check if target user is a root member
  if (family.male_root_member === user_id || family.female_root_member === user_id) {
    throw new ApiError(400, "Cannot remove a root member from the family");
  }

  // Fetch membership
  const membership = await Membership.findOne({ where: { family_id, user_id } });
  if (!membership) {
    throw new ApiError(404, "User is not a member of this family");
  }

  // Remove membership
  await membership.destroy();

  // Update user's parent_family to null
  const user = await User.findByPk(user_id);
  if (user) {
    user.parent_family = null;
    await user.save();
  }

   if (user.gender === "male") {
      const otherFamily = await Family.findOne({
        where: { male_root_member: user_id },
      });

      if (otherFamily) {
        otherFamily.ancestor = null; // unlink the ancestor
        await otherFamily.save();
      }
    }
  

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member removed successfully"));
});

const leaveMember = asyncHandler(async (req, res) => {
 const family_id = Number(req.params.family_id);
  const user_id= Number(req.user.user._id);

  if (!family_id || !user_id) {
    throw new ApiError(400, "family_id and user_id are required");
  }

  // Fetch family
  const family = await Family.findByPk(family_id);
  if (!family) throw new ApiError(404, "Family not found");


  // Check if target user is a root member
  if (family.male_root_member === user_id || family.female_root_member === user_id) {
    throw new ApiError(400, "Cannot remove a root member from the family");
  }

  // Fetch membership
  const membership = await Membership.findOne({ where: { family_id, user_id } });
  if (!membership) {
    throw new ApiError(404, "User is not a member of this family");
  }

  // Remove membership
  await membership.destroy();

  // Update user's parent_family to null
  const user = await User.findByPk(user_id);
  if (user) {
    user.parent_family = null;
    await user.save();
  }

   if (user.gender === "male") {
      const otherFamily = await Family.findOne({
        where: { male_root_member: user_id },
      });

      if (otherFamily) {
        otherFamily.ancestor = null; // unlink the ancestor
        await otherFamily.save();
      }
    }
  

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member removed successfully"));
});

const deleteFamily = asyncHandler(async (req, res) => {
  const family_id = Number(req.params.family_id);

  if (!family_id) throw new ApiError(400, "family_id is required");

  // Fetch family
  const family = await Family.findByPk(family_id);
  if (!family) throw new ApiError(404, "Family not found");

  const currentUserId = Number(req.user.user._id);

  // Only root members can delete
  if (family.male_root_member !== currentUserId && family.female_root_member !== currentUserId) {
    throw new ApiError(403, "Only root members can delete this family");
  }

  // Remove all memberships
  await Membership.destroy({ where: { family_id } });

  // Clear parent_family for all users who had this family
  await User.update({ parent_family: null }, { where: { parent_family: family_id } });

  // Clear ancestor for all families where ancestor == this family_id
  await Family.update(
    { ancestor: null },
    { where: { ancestor: family_id } }
  );

  // Delete the family
  await family.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Family deleted successfully"));
});

const joinFamily = asyncHandler(async (req, res) => {
  const { invitation_code } = req.body;
  const user_id = Number(req.user.user._id);

  if (!invitation_code) {
    throw new ApiError(400, "Invitation code is required");
  }

  // Check if family exists
  const family = await Family.findOne({ where: { invitation_code } });
  if (!family) throw new ApiError(404, "Invalid invitation code or family not found");

  // Check if user exists
  const user = await User.findByPk(user_id);
  if (!user) throw new ApiError(404, "User not found");

  // Check if user already belongs to another family
  if (user.parent_family !== null) {
    throw new ApiError(400, "You already belong to another family and cannot join");
  }

  // Check if user is already a member of this family
  const existingMembership = await Membership.findOne({
    where: { family_id: family.family_id, user_id },
  });
  if (existingMembership) {
    throw new ApiError(400, "You are already a member of this family");
  }

  // Create membership
  const membership = await Membership.create({
    family_id: family.family_id,
    user_id,
    role: "member",
  });

  // Update user's parent_family
  user.parent_family = family.family_id;
  await user.save();

  // If user is male → update ancestor of other families where he is root
  if (user.gender.toLowerCase() === "male") {
    const maleRootFamilies = await Family.findAll({
      where: { male_root_member: user.user_id },
    });

    for (const f of maleRootFamilies) {
      f.ancestor = family.family_id;
      await f.save();
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { family, membership },
      "Joined family successfully"
    )
  );
});


export { createFamily , getFamily , addMember , addRootMember , updateFamily , removeMember , deleteFamily , generateInvitationCode,leaveMember ,joinFamily};


