// components/common/Button.js
import React from 'react';

const RoundedButton = ({ type = 'button', onClick, children, className }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={` font-bold py-2 px-4 rounded-full ${className}`}
        >
            {children}
        </button>
    );
};

import PropTypes from 'prop-types';

RoundedButton.propTypes = {
  type: PropTypes.string, // Specifies the type attribute of the button
  onClick: PropTypes.func, // Click handler function
  children: PropTypes.node, // Button content (usually text or elements)
  className: PropTypes.string, // Additional CSS classes for styling
};

export default RoundedButton;
