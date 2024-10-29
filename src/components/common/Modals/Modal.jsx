import React from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  Classnames = "bg-white",
}) => {
  Modal.setAppElement("#root"); // Accessibility requirement

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"

          className="relative  w-full max-w-lg p-4 rounded-lg shadow-2xl z-[1100]"

          closeTimeoutMS={300}
          contentLabel="Custom Modal"
          shouldCloseOnOverlayClick={true} // Allow closing on overlay click
        >
          <motion.div
            className={`relative  p-6 rounded-lg shadow-2xl ${Classnames}`}
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition duration-300"
              aria-label="Close"
            >
              <MdClose size={24} />
            </button>

            {/* Modal Title */}
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
                {title}
              </h2>
            )}

            {/* Modal Body */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 mb-4">
              {children}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-4">
              {footer || (
                <Button variant="contained" color="primary" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  Classnames: PropTypes.string,
};

export default CustomModal;
