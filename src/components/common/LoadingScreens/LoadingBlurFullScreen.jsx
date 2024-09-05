import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const LoadingBlurScreen = () => {
 

  return (
    <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white background
      zIndex: 1300, // Ensures it's above all content
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(8px)", // Applies the blur effect
    }}
    >
      <CircularProgress />
      <div className="text-3xl">Please Wait...</div>
    </Box>
  );
};

export default LoadingBlurScreen;
