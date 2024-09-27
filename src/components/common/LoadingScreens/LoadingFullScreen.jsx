import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const LoadingFullScreen = () => {
 

  return (

    <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "white", // Semi-transparent white background
      zIndex: 1300, // Ensures it's above all content
      display: "flex",
      flexDirection: "column", // Aligns items vertically
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* Logo */}
    <img 
      src="/LOGO.png" 
      alt="LOGO" 
      className="object-contain" 
      style={{ 
        width: "200px", // Adjust size for different screen sizes if needed
        maxWidth: "20%", // Responsive width
        marginBottom: "16px" // Adds space between the logo and the spinner
      }} 
    />
  
   <div className="flex "> {/* Circular Progress (Loading Spinner) */}
    <CircularProgress />
  
    {/* Loading Text */}
    <div className="text-3xl mt-4">Please Wait...</div></div>
  </Box>
  
  );
};

export default LoadingFullScreen;
