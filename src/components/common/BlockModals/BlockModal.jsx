import React from "react";

import Modal from "react-modal";
import PropTypes from "prop-types";

const BlockModal = ({ open, onClose, onConfirm, message, buttonName ,loading=false}) => {
  // Set the app element for accessibility
  Modal.setAppElement("#root");

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      className="relative mx-auto my-auto   w-11/12 md:w-1/3 p-6 max-w-lg bg-white  rounded-lg shadow-xl border-t-4 transform transition-transform duration-300 ease-in-out"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1100] flex items-center justify-center"
      contentLabel="Block/Unblock Modal"
      closeTimeoutMS={300}
    >
      <div
        className={`border-t-4 ${
          buttonName !== "Block" ? "border-red-600" : "border-green-600"
        } p-4`}
      >
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          {message}
        </h2>
        <div className="flex justify-center space-x-6">
          <button
            className="bg-gray-300 text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
          disabled={loading}
            className={`  ${loading&&"cursor-not-allowed"} ${
              buttonName !== "Block"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}
            onClick={onConfirm}
          >
            {loading ? (
        <span className="loader  text-white mr-2">Loading...</span> // Optional loading spinner design
      ) : (
        buttonName
      )}
          </button>
        </div>
      </div>
    </Modal>
  );
};


BlockModal.propTypes = {
  open: PropTypes.bool.isRequired, // Modal visibility state
  onClose: PropTypes.func.isRequired, // Function to handle modal close
  onConfirm: PropTypes.func.isRequired, // Function to handle confirm action
  message: PropTypes.string.isRequired, // Modal message text
  buttonName: PropTypes.string.isRequired, // Text for the confirm button
  loading: PropTypes.bool, // Loading state for the button
};

export default BlockModal;




// import React from "react";

// const BlockModal = ({ open, onClose, onConfirm, message, buttonName }) => {
// 	if (!open) return null;
// 	return (
// 		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
// 			<div
// 				className={`bg-white p-6 rounded-md shadow-lg w-1/3 border-t-4 ${
// 					buttonName === "Block" ? "border-red-600" : "border-green-600"
// 				} `}
// 			>
// 				<h2 className="text-lg font-semibold mb-6 text-center">{message}</h2>
// 				<div className="flex justify-center space-x-4">
// 					<button
// 						className="bg-black text-white px-4 py-2 rounded-sm"
// 						onClick={onClose}
// 					>
// 						Cancel
// 					</button>
// 					<button
// 						className={`${
// 							buttonName === "Block" ? "bg-red-500" : "bg-green-600"
// 						} text-white px-4 py-2 rounded-sm`}
// 						onClick={onConfirm}
// 					>
// 						{buttonName}
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default BlockModal;