import React from 'react';
import Modal from 'react-modal';
import { MdClose } from 'react-icons/md';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const CustomModal = ({ isOpen, onClose, title, children, footer, Classnames = 'bg-white' }) => {
  Modal.setAppElement('#root'); // Accessibility requirement

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`transition-transform transform duration-300 ease-in-out   rounded-lg shadow-xl  w-9/12 md:w-1/2  p-6 relative ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      } ${Classnames}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out"
      closeTimeoutMS={300}
      contentLabel="Custom Modal"
    >
      {/* Modal Content */}
      <div className="relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition duration-200"
          aria-label="Close"
        >
          <MdClose size={24} />
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
            {title}
          </h2>
        )}

        {/* Modal Body */}
        <div className="mb-4">{children}</div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-2">
          {footer || (
            <Button variant="contained" color="primary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Determines if the modal is open or closed
  onClose: PropTypes.func.isRequired, // Close handler function
  title: PropTypes.string, // Optional title to display in the modal
  children: PropTypes.node, // Content of the modal
  footer: PropTypes.node, // Optional footer content (buttons, actions)
  Classnames: PropTypes.string, // Additional CSS classes for styling the modal
};

export default CustomModal;
