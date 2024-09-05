import React from 'react';
import Modal from 'react-modal';
import { MdClose } from 'react-icons/md';
import Button from '@mui/material/Button';

const CustomModal = ({ isOpen, onClose, title, children, footer }) => {
  Modal.setAppElement('#root'); // Accessibility requirement

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`transition-transform transform duration-300 ease-in-out bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 relative ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out"
      closeTimeoutMS={300}
      contentLabel="Custom Modal"
    >
      {/* Modal Content */}
      <div className="relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={24} />
        </button>

        {/* Modal Title */}
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}

        {/* Modal Body */}
        <div className="mb-4">{children}</div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 ">
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

export default CustomModal;
