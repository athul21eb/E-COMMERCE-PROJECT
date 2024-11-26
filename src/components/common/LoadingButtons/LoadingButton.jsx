// components/common/LoadingButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { RotatingLines } from 'react-loader-spinner';

const LoadingButton = ({ className, loadingText = 'Loading...' }) => {
    return (
        <motion.button
            type="button"
            className={`font-bold py-2 px-6 rounded-full flex items-center justify-center bg-blue-600 text-white disabled:opacity-90 ${className}`}
            disabled
        >
            <div className="flex items-center">
                <RotatingLines
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="24"
                    visible={true}
                />
                <span className="ml-3">{loadingText}</span>
            </div>
        </motion.button>
    );
};

LoadingButton.propTypes = {
    className: PropTypes.string, // Additional CSS classes for styling the button
    loadingText: PropTypes.string, // Text to display next to the spinner (default: 'Loading...')
};

export default LoadingButton;
