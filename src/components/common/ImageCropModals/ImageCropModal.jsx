import React, { useRef, useState, useEffect } from "react";
import PropTypes from 'prop-types'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaTimes } from "react-icons/fa";

const ImageCropperModal = ({ image, onCancel, onCropComplete ,size}) => {
	const [cropper, setCropper] = useState(null);
	const cropperRef = useRef(null);

	useEffect(() => {
		if (cropperRef.current) {
			setCropper(cropperRef.current.cropper);
		}
	}, []);

	const handleCrop = () => {
		if (cropper) {
			const croppedImage = cropper.getCroppedCanvas().toDataURL();
			if (typeof onCropComplete === "function") {
				onCropComplete(croppedImage);
			} else {
				console.error("onCropComplete is not a function");
			}
		} else {
			console.error("Cropper instance is not available.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="relative bg-white p-6 rounded-lg w-full max-w-4xl h-[90vh]">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">Crop Image</h2>
					<button className="text-gray-700 cursor-pointer" onClick={onCancel}>
						<FaTimes className="text-2xl" />
					</button>
				</div>

				<div className="relative h-[65vh] mb-6">
					<Cropper
						ref={cropperRef}
						src={image}
						style={{ height: "100%", width: "100%" }}
						aspectRatio={size??0.8/1}
						guides={false}
						scalable={true}
						cropBoxResizable={true}
						autoCropArea={1}
					/>
				</div>
				<div className="text-center m-2">
					<button
						className="py-2 px-4 rounded-md bg-black text-white font-medium"
						onClick={handleCrop}
					>
						Save
					</button>
					<button
						className="py-2 px-4 rounded-md bg-gray-300 text-black font-medium ml-2"
						onClick={onCancel}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

ImageCropperModal.propTypes = {
	image: PropTypes.string.isRequired, // image should be a URL or base64 string
	onCancel: PropTypes.func.isRequired, // onCancel should be a function
	onCropComplete: PropTypes.func.isRequired, // onCropComplete should be a function
	size: PropTypes.number, // size is optional and should be a number
  };

export default ImageCropperModal;


// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
// import * as Yup from "yup";
// import ImageCropperModal from "../../../components/common/admin/ImageCropModal";

// const AddProduct = () => {
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [isCropperOpen, setIsCropperOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const initialValues = {
//     productName: '',
//     description: '',
//     category: '',
//     brand: '',
//     gender: '',
//     regularPrice: '',
//     salePrice: '',
//     thumbnail: null,
//     stockAndSize: [{ stock: '', size: '' }],
//   };

//   const validationSchema = Yup.object({
//     productName: Yup.string().trim().required('Product Name is required'),
//     description: Yup.string().trim().required('Description is required'),
//     category: Yup.string().trim().required('Category is required'),
//     brand: Yup.string().trim().required('Brand is required'),
//     gender: Yup.string().trim().required('Gender is required'),
//     regularPrice: Yup.number().required('Regular Price is required').positive(),
//     salePrice: Yup.number().required('Sale Price is required').positive(),
//     thumbnail: Yup.mixed().required('Thumbnail image is required'),
//     stockAndSize: Yup.array()
//       .of(
//         Yup.object().shape({
//           stock: Yup.number().required('Stock is required').positive().integer(),
//           size: Yup.string().trim().required('Size is required'),
//         })
//       )
//       .min(1, 'At least one stock and size combo is required'),
//   });

//   const handleSubmit = (values) => {
//     console.log(values);
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setSelectedImage(reader.result);
//         setIsCropperOpen(true);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCropComplete = (croppedImage) => {
//     setThumbnailPreview(croppedImage);
//     setIsCropperOpen(false);
//   };

//   const handleCancelCrop = () => {
//     setIsCropperOpen(false);
//   };

//   return (
//     <div className="p-8 max-w-7xl mx-auto bg-white shadow-md rounded-md">
//       <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ setFieldValue }) => (
//           <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Other form fields */}

//             {/* Thumbnail Selection */}
//             <div className="space-y-4">
//               <label className="font-medium">Thumbnail</label>
//               {thumbnailPreview && (
//                 <img
//                   src={thumbnailPreview}
//                   alt="Cropped Thumbnail"
//                   className="w-48 h-48 object-cover mx-auto"
//                 />
//               )}
//               <div
//                 className="p-2 border border-gray-300 rounded-md cursor-pointer"
//                 onClick={() => document.getElementById('thumbnail-upload').click()}
//               >
//                 <input
//                   type="file"
//                   id="thumbnail-upload"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(event) => {
//                     handleImageChange(event);
//                     setFieldValue("thumbnail", event.target.files[0]);
//                   }}
//                 />
//                 {!thumbnailPreview && (
//                   <span className="text-gray-500 text-center block">
//                     Click to upload and crop thumbnail
//                   </span>
//                 )}
//               </div>
//               <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm" />
//             </div>
//           </Form>
//         )}
//       </Formik>

//       {isCropperOpen && (
//         <ImageCropperModal
//           image={selectedImage}
//           onCancel={handleCancelCrop}
//           onCropComplete={handleCropComplete}
//         />
//       )}
//     </div>
//   );
// };

// export default AddProduct;
