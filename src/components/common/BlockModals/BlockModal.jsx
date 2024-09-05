import React from "react";
import Modal from "react-modal";
import { Transition } from "react-transition-group";

const BlockModal = ({ open, onClose, onConfirm, message, buttonName }) => {
  // Set the app element for accessibility
  Modal.setAppElement("#root");

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      className="relative mx-auto my-auto w-full max-w-lg bg-white p-8 rounded-lg shadow-xl border-t-4 transform transition-transform duration-300 ease-in-out"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      contentLabel="Block/Unblock Modal"
      closeTimeoutMS={300}
    >
      <div
        className={`border-t-4 ${
          buttonName === "Block" ? "border-red-600" : "border-green-600"
        } p-4`}
      >
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          {message}
        </h2>
        <div className="flex justify-center space-x-6">
          <button
            className="bg-gray-300 text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${
              buttonName === "Block"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}
            onClick={onConfirm}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </Modal>
  );
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