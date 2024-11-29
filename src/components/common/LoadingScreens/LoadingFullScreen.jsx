import React from "react";
import { Box, Typography } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";

const LoadingFullScreen = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff", 
        zIndex: 1300, // Ensures it's above all content
        display: "flex",
        flexDirection: "column", // Align items vertically
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <img
        src="/LOGO.png"
        alt="LOGO"
        style={{
          width: "200px", // Adjust size as needed
          marginBottom: "20px", // Adds space between the logo and the spinner
        }}
      />

      {/* RotatingLines Loader with Loading Text */}
      <Box display="flex" alignItems="center" gap={2}>
        <RotatingLines
          strokeColor="#3f51b5"
          strokeWidth="5"
          animationDuration="0.75"
          width="40"
          visible={true}
        />
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.5rem", // Large text size
            color: "#333", // Text color
          }}
        >
          Please Wait...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingFullScreen;
