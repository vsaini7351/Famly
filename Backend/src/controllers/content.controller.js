import Photo from '../models/story.models.js';
import Video from '../models/video.models.js';
import Text from '../models/text.models.js';
import { User } from '../../postgres/models/index.js'; // ise apne according change kar lena
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// -------------------- CREATE CONTENT --------------------

// Upload Photo
const createPhoto = asyncHandler(async (req, res, next) => {

   if(!req.body){
    throw ApiError(404 , "req.body is not available")
   }


  const { familyId, title, description, aiTags } = req.body;

   if (!familyId && !title) {
    throw new ApiError(400, 'title is required');
  }


  // check photo file ya url hai ya  nhi 
  if (!req.file && !req.body.photoUrl) {
    throw new ApiError(400, 'Photo file or URL is required');
  }


  let photoUrl = req.body.photoUrl || '';
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult?.url) throw new ApiError(500, 'Cloudinary upload failed');
    photoUrl = uploadResult.url;
  }

  const photo = await Photo.create({
    familyId,
    userId: req.user.user_id,
    title,
    description,
    photoUrl,
    aiTags: aiTags || [],
    linkedBy: [],
    createdAt: new Date(),
  });

  res.status(201).json(new ApiResponse(201, photo, 'Photo uploaded successfully'));
});




// Upload Video
const createVideo = asyncHandler(async (req, res, next) => {

   if(!req.body){
    throw ApiError(404 , "req.body is not available")
   }

  const { familyId, title, description, aiTags } = req.body;

  if (!req.file && !req.body.videoUrl) {
    throw new ApiError(400, 'Video file or URL is required');
  }

  let videoUrl = req.body.videoUrl || '';
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult?.url) throw new ApiError(500, 'Cloudinary upload failed');
    videoUrl = uploadResult.url;
  }

  const video = await Video.create({
    familyId,
    userId: req.user.user_id,
    title,
    description,
    videoUrl,
    metadata: req.body.metadata || {},
    aiTags: aiTags || [],
    linkedBy: [],
    createdAt: new Date(),
  });

  res.status(201).json(new ApiResponse(201, video, 'Video uploaded successfully'));
});



// Upload Text
const createText = asyncHandler(async (req, res, next) => {
  const { familyId, title, content, aiTags } = req.body;
  if (!content) throw new ApiError(400, 'Text content is required');

  const text = await Text.create({
    familyId,
    userId: req.user.user_id,
    title,
    content,
    aiTags: aiTags || [],
    linkedBy: [],
    createdAt: new Date(),
  });

  res.status(201).json(new ApiResponse(201, text, 'Text content uploaded successfully'));
});


// -------------------- GET CONTENT WITH USER TIMELINE --------------------

// Get all content for a family with user info
const getFamilyContentWithUser = asyncHandler(async (req, res, next) => {
  const familyId = parseInt(req.params.familyId);

  const [photos, videos, texts] = await Promise.all([
    Photo.find({ familyId }).lean(),
    Video.find({ familyId }).lean(),
    Text.find({ familyId }).lean(),
  ]);

  // Fetch users from Postgres
  const userIds = [...new Set([...photos, ...videos, ...texts].map(c => c.userId))];
  const users = await User.findAll({
    where: { user_id: userIds },
    attributes: ['user_id', 'name', 'email', 'profile_photo'],
  });

  const userMap = {};
  users.forEach(u => (userMap[u.user_id] = u));

  const attachUser = items => items.map(item => ({ ...item, user: userMap[item.userId] || null }));

  res.json(new ApiResponse(200, {
    photos: attachUser(photos),
    videos: attachUser(videos),
    texts: attachUser(texts),
  }, 'Family content fetched successfully'));
});

// -------------------- GET CONTENT BY TYPE --------------------

const getAllPhotos = asyncHandler(async (req, res, next) => {
  const photos = await Photo.find().lean();
  res.json(new ApiResponse(200, photos, 'All photos fetched successfully'));
});

const getAllVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find().lean();
  res.json(new ApiResponse(200, videos, 'All videos fetched successfully'));
});

const getAllTexts = asyncHandler(async (req, res, next) => {
  const texts = await Text.find().lean();
  res.json(new ApiResponse(200, texts, 'All text contents fetched successfully'));
});

// -------------------- EXPORT --------------------
export {
  createPhoto,
  createVideo,
  createText,
  getFamilyContentWithUser,
  getAllPhotos,
  getAllVideos,
  getAllTexts,
};
