import {v2 as cloudinary} from "cloudinary"
// cloudinary gives link of pdf , image , avatar
import fs from "fs"




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });




    const uploadOnCloudinary = async (localfilepath) =>{
      try{
          if(!localfilepath) return null;
        const response = await  cloudinary.uploader.upload(localfilepath , {
            resource_type : "auto"

          }) // uploading the file from local folder to the cloudinary and auto is used to automatically detct the file type 
          
          console.log("uploaded successfully " , response.url);
         console.log("Cloudinary Upload Response:", JSON.stringify(response, null, 2));
          fs.unlinkSync(localfilepath) // to delete a file synchronously from local file system delete after uploading on cloudinary 
          return response;
      }catch(error){
            fs.unlinkSync(localfilepath) // remove the locally saved temp file as the upload operation got failed
            return null; 
      }
    }


    export const deleteFromCloudinary = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};

   
   
  export {uploadOnCloudinary}
   