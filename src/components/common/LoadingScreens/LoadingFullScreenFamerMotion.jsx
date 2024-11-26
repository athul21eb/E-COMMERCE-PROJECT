import React from "react";
import { RotatingLines } from "react-loader-spinner";

const LoadingFullScreenAnimation = () => {
  return (
    <div>
      <CutoutTextLoader
        height="450px"
        background="white"
        imgUrl="/LOGO.png"
      />
    </div>
  );
};

const CutoutTextLoader = ({ height, background, imgUrl }) => {
  return (
    <div className="relative flex items-center justify-center" style={{ height }}>
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Overlay with Animation */}
      <div
        style={{ background }}
        className="absolute inset-0 animate-pulse z-10 opacity-80"
      />

      {/* Rotating Lines Loader */}
      <div className="z-30">
        <RotatingLines
          strokeColor="blue"
          strokeWidth="5"
          animationDuration="0.75"
          width="50"
          visible={true}
        />
      </div>

      {/* Cutout Text */}
      <span
        className="font-black absolute z-20 text-center bg-clip-text text-transparent pointer-events-none"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          fontSize: "clamp(3rem, 12vw, 10rem)",
          lineHeight: height,
        }}
      >
        Loading...
      </span>
    </div>
  );
};

export default LoadingFullScreenAnimation;
