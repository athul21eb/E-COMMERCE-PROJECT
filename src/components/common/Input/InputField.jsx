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

export default InputField;
