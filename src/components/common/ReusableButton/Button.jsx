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

export default RoundedButton;
