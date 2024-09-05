import React from "react";

import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh", // Make it take up the entire viewport
        padding: "2rem",
        backgroundColor: "rgba(240, 240, 240, 0.9)", // Light grey background
      }}
    >
      <CircularProgress size={40}/>

      <Typography
        variant="h6"
        sx={{
          mt: 2,
          fontWeight: "bold",
          fontSize: "2rem",
          position: "relative",
          display: "inline-flex",
          
        }}
      >
        Loading
        <span className="loading-dots">...</span>
      </Typography>
      <style jsx>{`
        .loading-dots {
          position: absolute;
          top: 0;
          left: 100%;
          margin-left: 5px;
          font-size: 1.5rem;
          animation: dots 1.5s infinite;
        }

        @keyframes dots {
          0% {
            content: ".";
          }
          33% {
            content: "..";
          }
          66% {
            content: "...";
          }
          100% {
            content: "....";
          }
        }
      `}</style>


    </Box>
  );
};


export default LoadingScreen;
