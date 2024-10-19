// components/common/InputField.js
import React from 'react';

const InputField = ({ id, label, name, type,placeholder, autoComplete, required, autoFocus }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                autoFocus={autoFocus}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    );
};

import PropTypes from "prop-types";

InputField.propTypes = {
  id: PropTypes.string.isRequired, // Input field identifier
  label: PropTypes.string.isRequired, // Label for the input field
  name: PropTypes.string.isRequired, // Name attribute for the input field
  type: PropTypes.string, // Type of input (e.g., text, password)
  placeholder: PropTypes.string, // Placeholder text for the input field
  autoComplete: PropTypes.string, // Autocomplete attribute
  required: PropTypes.bool, // Whether the input is required
  autoFocus: PropTypes.bool, // Whether the input should be auto-focused
};


export default InputField;
