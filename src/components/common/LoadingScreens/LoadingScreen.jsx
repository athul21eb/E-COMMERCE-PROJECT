import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/themeContext";

const LoadingScreen = () => {
  const { themeStyles } = useTheme();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const circleVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: "2rem",
        backgroundColor: themeStyles.background,
      }}
    >
      <motion.div
        variants={circleVariants}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `4px solid ${themeStyles.accent}`,
          borderTop: `4px solid ${themeStyles.background}`,
          animation: "spin 1s linear infinite",
        }}
      />

      <motion.div variants={textVariants}>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: "bold",
            fontSize: "2rem",
            color: themeStyles.textPrimary,
            position: "relative",
            display: "inline-flex",
          }}
        >
          Loading
          <motion.span
            animate={{
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{
              marginLeft: "0.25rem",
            }}
          >
            ...
          </motion.span>
        </Typography>
      </motion.div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </motion.div>
  );
};

export default LoadingScreen;