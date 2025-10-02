//import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import  jwt from "jsonwebtoken"
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

// this method is used to return access and refresh token od user by giving input as userID 
const generateAccessAndRefreshTokens = async(userId)=> {
  try {
    const user =  await User.findById(userId)
     console.log("User from DB:", user);
    if (!user) {
  throw new ApiError(404, "User not found for token generation");
}
   const accessToken =  user.generateAccessToken()
   const refreshToken =  user.generateRefreshToken()
// we have access and refresh token and we are goin to save it in database 
   user.refreshToken = refreshToken
  await  user.save({validateBeforeSave : false})

 return{accessToken , refreshToken}

  } catch (error) {
     console.error("Error generating tokens:", error);
    throw new ApiError(500 , "Something went wrong ");
  }
}


 const registerUser = asyncHandler( async (req , res ) => {
  
   //  get user details from frontend
   // validation (check info of user- not empty)
   // check if user already exist: username , email
   // check for image and avatar
   // upload them to cloudinary , avatar
   // create user object - create entry in db
   // remove password and refresh token field form response
   //check for user creation 
   // return response
  const { fullname, email, username, password } = req.body;
  console.log("email :",email );
 

  // now we are checking that if all the fields are filled or not .some() return true or false and trim is removing spaces only
  if(                                                   
    [fullname , email , username , password].some((field)=> typeof field !== "string" || 
    field.trim() === "")
  ){
    throw new ApiError(400 , " All fields are requried ");
  }

  const existedUser = await User.findOne({
  $or: [{ username }, { email }]
  // we are checking if there exist smae username or email . this is the way to check using $ or
    // # mutter gives us req.files to handle files
  })

  if(existedUser){
    throw new ApiError(409 , "User with email or username is already exist");
  }
 

 
 // ?. is optinal safty it handle null or undefined 
  console.log("req.files: " , req.files);

// we are making avatar as necessary field but coverimage as optional . So we are checking !avatarLacalpath and throwing error , for coverimage we have to check if user has entered or not

let coverImageLocalpath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalpath = req.files.coverImage[0].path;
}

let avatarLocalpath;
if(!req.files || !Array.isArray(req.files.avatar) || req.files.avatar.length === 0){
     throw new ApiError(400 , " Avatar file is required");
}
avatarLocalpath = req.files.avatar[0].path;



  const avatar = await uploadOnCloudinary(avatarLocalpath)
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if(!avatar){
    throw new ApiError(400 , "Avatar is required");
  }

  // user.model is used to talk to db
 const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase ()
  })
// we are checking user is created or not mongoose gives _id to every element 
 const createdUser = await  User.findById(user._id).select(
  "-password -refeshToken"
 )   // in this method , we are removing the password nad refreshToken by using findbyid function and it takes string with element to be  deleted with space and minus

 if(!createdUser){
  throw new ApiError(500 , "Something went wrong  while registing the user");
 }


// we are sending the response with status and 
  return res.status(201).json(
    new ApiResponse(200 , createdUser , " User registered SUccessfully ")
  )
});

// method to login the user using the userid
const loginUser = asyncHandler(async(req, res)=>{
      // req body -> data
      // username or email 
      //find the user
      // check password
      // access and refresh token to user
      //send cookies 

      const {email , username , password} = req.body
      console.log("email is : " ,email );
      if(!username && !email){
        throw new ApiError(400 , "Useraname or email is required");
      }
      // we are using user to find email or username  If a matching user is found, then user will contain:A JavaScript object representing that document from the User collection.like {_id: "64bd93e98f7c1...",username: "anupam123",}
      //otherwise null;
  


    const user =  await User.findOne({
        $or:[{username} , {email}]
      })
// checking if user data is fetched or not
      if(!user){
        throw new ApiError(404 , "user does not exist");
      }
// this User is mongoose database object which has methos like update , findone whereas this user is made by us which has method which we have defined in user.model.js like gerentatetoken etc  
     const isPasswordValid =  await user.isPasswordCorrect(password);

       if(!isPasswordValid){
        throw new ApiError(401, "password does not incorrect");
      }
  
      const {accessToken , refreshToken} =  await generateAccessAndRefreshTokens(user._id)
      // now we have access and refesh token and goin to decide what we ahve to send to user in cookies 
// updating the user 
    const loggedInUser =  await User.findById(user._id).select("-password -refreshToken");
// refuse the frontend to edit the password
    const options ={
      httpOnly : true,
      secure : true
    }

    return res.status(200).cookie("accessToken" , accessToken , options).cookie("refreshToken" , refreshToken , options).json(
      new ApiResponse(200 , {user : loggedInUser , accessToken , refreshToken },
        "User loggedin successfully"
      )
    )

})


// method to log out the user 
//we are making new object(user) in req using middleware like verifyJWT in routerfile.js 
const logoutUser = asyncHandler(async(req ,res)=>{
   await  User.findByIdAndUpdate(
      req.user._id,
    {
        $unset : {
          refreshToken : 1 // this remove the field from user to make him logout
        }
    },
    {
      new : true
    } 
     )


   const options = {
      httpOnly : true,
      secure : true
    }

    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "user logged out"))
    
    

})


// we are making end points so if someone just toucht that end points then we shall give me another access token for few minutes
const refreshAccessToken  = asyncHandler(async(req , res)=>{
    const incomingAccessToken =  req.cookies.refreshToken || req.body.refreshToken

    if(!incomingAccessToken){
      throw new ApiError(401 , "unauthorised request");
    }
// we have user refreshToken which has unique id which we have given it in user.model.js during generationAccessToken 
  try {
    const decodedToken =  jwt.verify(
        incomingAccessToken,
        process.env.REFRESH_TOKEN_SECRET
      )
  
    const user =  await User.findById(decodedToken?._id)
   if(!user){
        throw new ApiError(401 , "invalid token");
   }
   // we have stored token of database and incoming token we wiil check it and proceed further
     
   if(incomingAccessToken !== user?.refeshToken){
    throw new ApiError(404 , "refresh token is expired or used")
   }
  
   const {accessToken , newRefeshToken } = await generateAccessAndRefreshTokens(user._id)
  
   const options = {
    httpOnly:true,
    secure:true
   }
  
    return res.status(200).cookie("accessToken" , accessToken , options).
    cookie("refreshToken" , refeshToken)
    .json(
      new ApiResponse(
        200,
        {accessToken , refreshToken :newRefeshToken},
        "Access token refreshed successfully"
      )
    )
  } catch (error) {
     throw new ApiError(401 , error?.message || "invalid refreshtoken")
  }

})




const changeCurrentPassword = asyncHandler(async(req , res)=>{
  const {oldpassword , newpassword } = req.body

  


 const user = await User.findById(req.user?._id) //fetch the currently logged-in user's data from the database.

 const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);

 if(!isPasswordCorrect){
  throw new ApiError(400 , "Invalid old password");
 }

 user.password = newpassword
 await user.save({validateBeforeSave : false})

 return res.status(200)
 .json(new ApiResponse(200 , { } , "password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req, res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200 , req.user , "current user fetched succesfully"))
})


const updateAccountDetails = asyncHandler(async(req , res)=>{
  const {fullname , email} = req.body

  if(!fullname || ! email){
    throw new ApiError(400 , "All field are required")
  }
   
 const user =await  User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        fullname :fullname,
        email : email
      }
    },
    {new :true}   // return after updation 
  ).select("-password ")

  return res.status(200).json(new ApiResponse(200 , user , "Account details updated successfully"))

})
// updating the file in backend

const updateUserAvater = asyncHandler(async(req , res) => {
    const avatarLocalpath =  req.files?.path
    if(!avatarLocalpath){
      throw new ApiError(400 , "Avatar file is missing")
    }

   const user1 = await User.findById(req.user._id);

   if(user1?.avatar?.public_id) {
          await deleteFromCloudinary(user1.avatar.public_id);
   }


    const avatar = await uploadOnCloudinary(avatarLocalpath)

    if(!avatar.url){
       throw new ApiError(400 , "error while updating Avatar file ")
    }

 const user =    await User.findByIdAndUpdate(
      req.user?._id , 
      {
       //This tells MongoDB:“In that user document, replace the entire avatar field with this new object:”
        $set : {
             avatar : { 
                   url: avatar.url,
                   public_id: avatar.public_id
             }
        }
      },
      {new : true} // “Return the updated document, not the old one.”
    ).select("-password ")
//findByIdAndUpdate updates the database document directly in MongoDB, using $set. No need to call .save() manually when using findByIdAndUpdate.

     return res.status(200).json(
      new ApiResponse(200 , user , "avatar is updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req , res) => {
    const CoverImageLocalpath =  req.files?.path
    if(!CoverImageLocalpath){
      throw new ApiError(400 , "coverImage file is missing")
    }

    const coverimage = await uploadOnCloudinary(CoverImageLocalpath)

    if(!coverimage.url){
       throw new ApiError(400 , "error while updating coverimage file ")
    }

  const user =   await User.findByIdAndUpdate(
      req.user?._id , 
      {
        // we want to update the one parameter so use set
        $set : {
             coverimage :  coverimage.url
        }
      },
      {new : true}
    ).select("-password ")

    return res.status(200).json(
      new ApiResponse(200 , user , "coverimage is updated successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req , res)=>{
 const {username} = req.params               //req.params is always used to extract dynamic parts of your URL path.

 if(!username?.trim()) throw new ApiError(400 , "username is missing");

 //aggregate is a method you use to process data records and transform them into computed results.

 //It’s basically a pipeline of operations applied step by step to your documents.

 //Think of it like:
//Input Documents  [stage 1 ➡️ stage 2 ➡️ stage3...]  and return array
 
    const channel = await User.aggregate([
      {
        $match:{   // this select the only those model which has required username and change into next state  
          username : username?.toLowerCase()
          // username: username
        }
      },
      { // This aggregation stage is performing a join between collections in MongoDB
        $lookup:{
          from:"subscriptions", 
          localField : "_id",
          foreignField:"channel",
          as : "subscribers"
        }
      },
        //(1)This tells MongoDB: “I want to pull documents from the subscriptions collection.
        //(2)In the current collection, use the field _id as the join key.
        //(3)In the subscriptions collection, find all documents where the channel field matches the localField.
        //(4)Put the matched documents into an array called subscribers in the result.
        //this would like this 
  // {
  // _id: "CAC",
  // name: "Code Academy Channel",
  // subscribers: [
  //   { channel: "CAC", subscriber: "a" },
  //   { channel: "CAC", subscriber: "b" }
  // ]}  }
     {
      $lookup:{
        from:"subscriptions",
         localField : "_id",
          foreignField:"subscriber",
          as : "subscribedTo"   // maine kitne logo ko subscribe kiya h
      }
     },
     { //adding two more count field
      $addFields:{
        subscribersCount : {
          $size:"$subscribers"
        },
        channelsSubscribedTOCount :{
          $size : "$subscribedTo"
        },
        //checking if user is subscribed or not and sending true or false to frontend for subsrcibe button 
        isSubscribed :{
          $cond:{   // cond takes three paramter (if,then,else)
            if:{$in: [req.user?._id , "$subscribers.subscriber"] },
            then :true,
            else : false
          }
        }
      }
     },
     { //"In the final result, only include these fields, and leave out everything else.( You control exactly what the frontend)
       $project:{
        fullname:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedTOCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1
       }
     }
 
    ]) 
   
    
    if(!channel?.length) throw new ApiError(404 , "channel doesnot exist");
     console.log("requored data of user subscribed " , channel);

     return res
     .status(200)
     .json(
      new ApiResponse(200 , channel[0], "user channel fetched successfully")
     )

})

const getWatchHistory = asyncHandler(async(req , res)=>{

     const user = await User.aggregate([
        {
          $match : {
            _id : new mongoose.Types.ObjectId(req.user._id)
          }
        },
        {
          $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField : "_id",
            as : "watchHistory",
            pipeline:[
              {
                $lookup :{
                  from : "users",
                  localField : "owner",
                  foreignField : "_id",
                  as : "owner",
                  pipeline : [
                    {
                      $project:{
                        fullname : 1,
                        username :1,
                        avatar:1
                      }
                    }
                  ]
                }
              },
              {
                $addFields:{
                  owner  :{
                    $first : "$owner"
                  }
                }
              }
            ]
          }
        }
      ])
    
      
return res.status(200).json(
  new ApiResponse(200 , user[0].watchHistory )
)

})


export{
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateUserAvater,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
}



