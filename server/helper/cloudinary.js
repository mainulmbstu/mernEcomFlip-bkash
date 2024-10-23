const { v2:cloudinary }= require( "cloudinary");
const fs = require( "fs");


    // Configuration
    cloudinary.config({
      cloud_name: "dgj1icpu7",
      api_key: "192926895148929",
      api_secret: "TT4K81WU5_4uFTrNLh1Kl2hIBWs", // Click 'View API Keys' above to copy your API secret
    });

  // Upload an image

const uploadOnCloudinary = async (filePath, folderName) => {
      try {
        const result=await cloudinary.uploader.upload(filePath,{folder:folderName})
        
        try {
          fs.unlinkSync(filePath)
        } catch (error) {
         console.log(error);
         return({ msg: "Failed to delete image from server", error });           
          }
          return {
              secure_url: result.secure_url,
              public_id: result.public_id
         } 
          
      } catch (error) {
        console.log(error);
        return ({ msg: "error from upload cloudinary", error });
      }
}
//========================================================
const deleteImageOnCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result

  } catch (error) {
    console.log(error);
    res.status(401).send({ msg: "error from delete cloudinary", error });
  }
};

module.exports = { uploadOnCloudinary, deleteImageOnCloudinary };
