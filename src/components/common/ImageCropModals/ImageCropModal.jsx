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



