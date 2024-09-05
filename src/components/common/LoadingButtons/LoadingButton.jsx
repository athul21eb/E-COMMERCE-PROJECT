// components/common/LoadingButton.js
import React from 'react';

const LoadingButton = ({ className, loadingText = 'Loading...' }) => {
    return (
        <button
            type="button"
            className={`font-bold py-2 px-4 rounded-full flex items-center justify-center ${className}`}
            disabled
        >
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
            {loadingText}
        </button>
    );
};

export default LoadingButton;
