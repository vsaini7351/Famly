import { Story } from "../models/story.models.js";
import { deleteAudioOnCloudinary, deleteImageOnCloudinary, deleteVideoOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError,ApiResponse } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


const createStory = asyncHandler(async (req, res) => {
  const { title, caption, family_id,memory_date,ai_tags } = req.body;
  const uploaded_by = req.user.user_id; // from auth middleware
  const mediaFiles = req.files || []; // from multer
  const mediaText = req.body.mediaText || []; // array of text for media

  if (!title || !family_id) {
    throw new ApiError(400, "Title and family_id are required");
  }

   let captionTags = [];
  if (caption) {
    const regex = /#(\w+)/g;
    captionTags = [];
    let match;
    while ((match = regex.exec(caption)) !== null) {
      captionTags.push(match[1]);
    }
  }
  const combinedTags = [
    ...(Array.isArray(ai_tags) ? ai_tags : ai_tags ? [ai_tags] : []),
    ...captionTags
  ];

  const normalizedTags = [...new Set(combinedTags.map(tag => tag.toLowerCase()))];


  const media = [];

  for (let i = 0; i < mediaFiles.length; i++) {
    const file = mediaFiles[i];
    let resourceType = "auto";

    if (file.mimetype.startsWith("image")) resourceType = "image";
    if (file.mimetype.startsWith("video")) resourceType = "video";
    if (file.mimetype.startsWith("audio")) resourceType = "audio";

    const uploadResponse = await uploadOnCloudinary(file.path, resourceType);

    media.push({
      type: resourceType,
      url: uploadResponse.secure_url,
      text: mediaText[i] || "",
      order: i
    });
  }

  const story = await Story.create({
    title,
    caption,
    family_id,
    uploaded_by,
    media,
    memory_date,
    tags:normalizedTags
  });

 
  return res
    .status(200)
    .json(new ApiResponse(200, story, "story uploaded successfully!"));
});

const deleteStory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

  
  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    throw new ApiError(404, "Invalid or missing Story ID");
  }

  
  const story = await Story.findById(storyId);
  if (!story) {
    throw new ApiError(404, "Story not found");
  }

  
  if (story.uploaded_by.toString() !== req.user.user_id.toString()) {
    throw new ApiError(401, "You are not authorised to delete this story");
  }

 
  for (const media of story.media) {
   try {
    if (media.type === "image") await deleteImageOnCloudinary(media.url);
    else if (media.type === "video") await deleteVideoOnCloudinary(media.url);
    else if (media.type === "audio") await deleteAudioOnCloudinary(media.url);
  } catch (err) {
    console.error(`Failed to delete ${media.type} from Cloudinary:`, err);
  }
  }

  
  const deletedStory = await Story.findByIdAndDelete(storyId);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedStory, "Story deleted successfully!"));
});

 const likeStory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

 
  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    throw new ApiError(404, "Invalid or missing Story ID");
  }

  
  const story = await Story.findById(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  const userId = req.user.user_id.toString();

  if (!story.liked_by.includes(userId)) {
    story.liked_by.push(userId);
    await story.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Story liked successfully!"));
});


const unlikeStory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

  
  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    throw new ApiError(404, "Invalid or missing Story ID");
  }


  const story = await Story.findById(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  const userId = req.user.user_id.toString();
  story.liked_by = story.liked_by.filter(id => id.toString() !== userId);

  await story.save();

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Story unliked successfully!"));
});

const getFamilyStoriesAsc = asyncHandler(async (req, res) => {
  const { familyId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (!familyId) throw new ApiError(400, "Family ID is required");

  // Convert familyId to integer
  const familyIdNum = parseInt(familyId);

  const stories = await Story.find({ family_id: familyIdNum })
    .sort({ memory_date: 1 }) // ascending
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Story.countDocuments({ family_id: familyIdNum });

  return res.status(200).json(
    new ApiResponse(200, {
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, "Stories fetched in ascending order")
  );
});

const getFamilyStoriesDesc = asyncHandler(async (req, res) => {
  const { familyId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (!familyId) throw new ApiError(400, "Family ID is required");

  const stories = await Story.find({ family_id: familyId })
    .sort({ createdAt: -1 }) // descending
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Story.countDocuments({ family_id: familyId });

  return res.status(200).json(
    new ApiResponse(200, {
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, "Stories fetched in descending order")
  );
});


// future aspects
// const updateStory = asyncHandler(async (req, res) => {
//   const { storyId } = req.params;
//   const { caption, deleteMediaIndexes = [], mediaText = [] } = req.body; // deleteMediaIndexes: array of indexes in story.media
//   const newFiles = req.files; // multer uploaded files
//   const userId = req.user.user_id;

//   if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
//     throw new ApiError(404, "Invalid or missing Story ID");
//   }

//   const story = await Story.findById(storyId);
//   if (!story) throw new ApiError(404, "Story not found");

//   if (story.uploaded_by.toString() !== userId.toString()) {
//     throw new ApiError(401, "You are not authorized to update this story");
//   }

 
//   if (deleteMediaIndexes.length > 0) {
//     // Ensure not all media are deleted
//     if (deleteMediaIndexes.length >= story.media.length) {
//       throw new ApiError(400, "You cannot delete all media from a story");
//     }

//     // Delete from Cloudinary and remove from array
//     deleteMediaIndexes.sort((a, b) => b - a).forEach(index => {
//       const media = story.media[index];
//       if (media.type === "image") deleteImageOnCloudinary(media.url);
//       if (media.type === "video") deleteVideoOnCloudinary(media.url);
//       if (media.type === "audio") deleteAudioOnCloudinary(media.url);
//       story.media.splice(index, 1);
//     });
//   }

//   // Update caption if provided
//   if (caption !== undefined) story.caption = caption;

//   // Add new media files
//   if (newFiles && newFiles.length > 0) {
//     for (let i = 0; i < newFiles.length; i++) {
//       const file = newFiles[i];
//       let resourceType = "auto";

//       if (file.mimetype.startsWith("image")) resourceType = "image";
//       if (file.mimetype.startsWith("video")) resourceType = "video";
//       if (file.mimetype.startsWith("audio")) resourceType = "audio";

//       const uploadResponse = await uploadOnCloudinary(file.path, resourceType);

//       story.media.push({
//         type: resourceType,
//         url: uploadResponse.secure_url,
//         text: mediaText[i] || "",
//         order: story.media.length
//       });
//     }
//   }

//   await story.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, story, "Story updated successfully!"));
// });

const updateStory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;
  const { caption } = req.body; // Only allow updating caption
  const userId = req.user.user_id;

  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    throw new ApiError(404, "Invalid or missing Story ID");
  }

  const story = await Story.findById(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  if (story.uploaded_by.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this story");
  }

  // Update caption if provided
  if (caption !== undefined) story.caption = caption;

  await story.save();

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Caption updated successfully!"));
});

const getStory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

  
  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    throw new ApiError(404, "Invalid or missing Story ID");
  }

  // Fetch the story
  const story = await Story.findById(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Story fetched successfully!"));
});


const getRecentStories = asyncHandler(async (req, res) => {
  const userId = req.user.user_id; // from auth middleware
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  
  const memberships = await Membership.findAll({ where: { user_id: userId } });
  const familyIds = memberships.map(m =>  parseInt(m.family_id));

  if (familyIds.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No stories found"));
  }

  
  const stories = await Story.find({ family_id: { $in: familyIds } })
    .sort({ memory_date: -1, createdAt: -1 }) // recent first
    .skip(skip)
    .limit(limit);


  const totalStories = await Story.countDocuments({ family_id: { $in: familyIds } });
  const totalPages = Math.ceil(totalStories / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      stories,
      pagination: {
        page,
        limit,
        totalPages,
        totalStories
      }
    }, "Recent stories fetched successfully")
  );
});

const getUserRecentStories = asyncHandler(async (req, res) => {
  const userId = req.user.user_id; // from auth middleware
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch stories uploaded by this user
  const stories = await Story.find({ uploaded_by: userId })
    .sort({ memory_date: -1, createdAt: -1 }) // recent first
    .skip(skip)
    .limit(limit);

  const totalStories = await Story.countDocuments({ uploaded_by: userId });
  const totalPages = Math.ceil(totalStories / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      stories,
      pagination: {
        page,
        limit,
        totalPages,
        totalStories
      }
    }, "User's recent stories fetched successfully")
  );
});




export {createStory,deleteStory,likeStory,unlikeStory,getFamilyStoriesAsc,
  getFamilyStoriesDesc,updateStory,getStory,getRecentStories,getUserRecentStories}
