// components/common/LoadingButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const LoadingButton = ({ className, loadingText = 'Loading...' }) => {
    return (
        <motion.button
            type="button"
            className={`font-bold py-2 px-4 rounded-full flex items-center justify-center ${className}`}
            disabled
            initial={{ scale: 1 }}
            animate={{ scale: 0.9 }}
            transition={{
                
                stiffness: 400,
                damping: 10,
                repeat: Infinity,
                repeatType: "reverse",
            }}
        >
            <motion.div
                className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"
                animate={{ rotate: 360 }}
                transition={{
                    ease: "linear",
                    duration: 1,
                    repeat: Infinity,
                }}
            />
            <motion.span
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                {loadingText}
            </motion.span>
        </motion.button>
    );
};

LoadingButton.propTypes = {
    className: PropTypes.string, // Additional CSS classes for styling the button
    loadingText: PropTypes.string, // Text to display next to the spinner (default: 'Loading...')
};

export default LoadingButton;
