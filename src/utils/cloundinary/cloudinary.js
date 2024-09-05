
// export const uploadImageToCloudinary = async (file) => {
 
//   const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
//   const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', UPLOAD_PRESET);



//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//     {
//       method: 'POST',
//       body: formData,
//     }
//   );

//   const data = await response.json();
//   return data.secure_url; // Return the URL of the uploaded image
// };



// import { v2 as cloudinary } from "cloudinary";

// export const uploadImage = async (imageUrl, folder) => {
// 	try {
// 		cloudinary.config({
// 			cloud_name: import.meta.env.VITE_CLOUD_NAME,
// 			api_key: import.meta.env.VITE_CLOUD_API_KEY,
// 			api_secret:import.meta.env.VITE_CLOUD_API_SECRET,
// 		});
// 		if (typeof imageUrl !== "string") {
// 			throw new Error("Invalid imageUrl: expected a string.");
// 		}
// 		const result = await cloudinary.uploader.upload(imageUrl, {
// 			folder: folder,
			
// 		});
// 		return result.secure_url;
// 	} catch (error) {
// 		console.error("Error uploading image:", error);
// 		throw error;
// 	}
// };

export const uploadImage = async (base64Url, folder) => {
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;

  // Prepare FormData for upload
  const formData = new FormData();
  formData.append('file', base64Url);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message || "Error uploading image");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

