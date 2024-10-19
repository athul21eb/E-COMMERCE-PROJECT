import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh", // Full viewport height
        padding: "2rem",
        backgroundColor: "rgba(240, 240, 240, 0.9)", // Light grey background
      }}
    >
      <CircularProgress size={40} />

      <Typography
        variant="h6"
        sx={{
          mt: 2,
          fontWeight: "bold",
          fontSize: "2rem",
          position: "relative",
          display: "inline-flex",
          "&::after": {
            content: '"..."',
            fontSize: "1.5rem",
            position: "absolute",
            ml: 1,
            animation: "dots 1.5s steps(3, end) infinite",
          },
        }}
      >
        Loading
      </Typography>

      {/* Keyframes for the dots animation */}
      <style>
        {`
          @keyframes dots {
            0%, 100% {
              content: " ";
            }
            33% {
              content: ".";
            }
            66% {
              content: "..";
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingScreen;
