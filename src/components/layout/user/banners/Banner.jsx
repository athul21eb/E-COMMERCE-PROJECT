import React from "react";

const Banner = ({ bannerImg }) => {
  return (
    <div className="relative overflow-hidden rounded-xl  hidden sm:block">
  {/* Background Image */}
  <img
    src={bannerImg}
    alt="Boots"
    className="cursor-pointer w-full h-40 sm:h-48 md:h-60 lg:h-72 xl:h-80 object-fill" 
  />
</div>

  );
};

export default Banner;



// Gradient Overlay
// <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

// {/* Content */}
// <div className="absolute inset-0 flex flex-col justify-center pl-8 sm:pl-12 md:pl-16 lg:pl-20 text-white">
//   <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
//     Limited time only
//   </p>
//   <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl font-extrabold mb-3 sm:mb-4 md:mb-6 leading-tight">
//     Get 30% off
//   </h3>
//   <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-md lg:max-w-lg xl:max-w-xl">
//     Sneakers made with your comfort in mind so you can put all of your
//     focus into your next session.
//   </p>
// </div>