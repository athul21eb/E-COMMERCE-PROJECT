import React from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../contexts/themeContext";


const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  Classnames = "",
}) => {
  const { themeStyles } = useTheme();

  Modal.setAppElement("#root"); // Accessibility requirement

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          overlayClassName="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
              backdropFilter: "blur(6px)", // Apply blur effect
            },
          }}
          
          className="relative w-full max-w-lg p-4 rounded-lg z-[1100]"
          closeTimeoutMS={300}
          contentLabel="Custom Modal"
          shouldCloseOnOverlayClick={true} // Allow closing on overlay click
        >
          <motion.div
            className={`relative p-6 rounded-lg shadow-2xl ${Classnames}`}
            style={{
              backgroundColor: themeStyles.surface,
              color: themeStyles.textPrimary,
              borderColor: themeStyles.border,
            }}
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 transition duration-300"
              style={{ color: themeStyles.textSecondary }}
              aria-label="Close"
            >
              <MdClose size={24} />
            </button>

            {/* Modal Title */}
            {title && (
              <h2
                className="text-xl sm:text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{
                  color: themeStyles.textPrimary,
                  borderBottomColor: themeStyles.border,
                }}
              >
                {title}
              </h2>
            )}

            {/* Modal Body */}
            <div
              className="max-h-80 overflow-y-auto scrollbar-thin mb-4"
              style={{
                color: themeStyles.textPrimary,
              }}
            >
              {children}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-4">
              {footer || (
                <Button
                  variant="contained"
                  style={{ backgroundColor: themeStyles.accent }}
                  onClick={onClose}
                >
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
  onClose: PropTypes.any.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  Classnames: PropTypes.string,
};

export default CustomModal;
