import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const BackButton = ({ label = "Go Back", className = "" }) => {
  const navigate = useNavigate();

  // Motion variants for animation
  const buttonVariants = {
    hover: { scale: 1.05, backgroundColor: '#4B5563', color: '#fff' },
    tap: { scale: 0.95 },
  };

  return (
    <motion.button
      onClick={() => navigate(-1)} // Navigates to the previous page
      className={`mb-4 flex items-center text-slate-600 transition-colors duration-300 border border-slate-600 rounded px-4 py-2 ${className}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.span className="mr-2">
        <FaArrowLeft />
      </motion.span>
      {label}
    </motion.button>
  );
};

BackButton.propTypes = {
  label: PropTypes.string, // Text to display on the button (default: "Go Back")
  className: PropTypes.string, // Additional CSS classes for styling
};

export default BackButton;
