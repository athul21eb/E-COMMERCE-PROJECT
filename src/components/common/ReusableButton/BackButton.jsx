import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = "Go Back", className = "", }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}  // Navigates to the previous page
      className={`px-4 py-2 bg-black hover:bg-gray-800 text-white rounded ${className}`} 
      
    >
      {label}
    </button>
  );
};
import PropTypes from 'prop-types';

BackButton.propTypes = {
  label: PropTypes.string, // Text to display on the button (default: "Go Back")
  className: PropTypes.string, // Additional CSS classes for styling
};

export default BackButton;
