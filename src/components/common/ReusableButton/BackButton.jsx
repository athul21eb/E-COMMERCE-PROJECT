import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/themeContext';

const BackButton = ({ label = "Go Back", className = "" }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Define colors for light and dark themes
  const buttonColors = {
    light: {
      background: 'white',
      text: '#374151', // Slate-700
      border: '#374151',
      hoverBackground: '#bdb7a8',
      hoverText: '#ffffff',
    },
    dark: {
      background: '#1F2937', // Slate-800
      text: '#D1D5DB', // Slate-300
      border: '#D1D5DB',
      hoverBackground: '#4B5563', // Slate-600
      hoverText: '#ffffff',
    },
  };

  const colors = theme === 'light' ? buttonColors.light : buttonColors.dark;

  // Motion variants for animation
  const buttonVariants = {
    hover: { scale: 1.05, backgroundColor: colors.hoverBackground, color: colors.hoverText },
    tap: { scale: 0.95 },
  };

  return (
    <motion.button
      onClick={() => navigate(-1)}
      className={`mb-4 flex items-center transition-colors duration-300 rounded px-4 py-2 ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
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
  label: PropTypes.string,
  className: PropTypes.string,
};

export default BackButton;
