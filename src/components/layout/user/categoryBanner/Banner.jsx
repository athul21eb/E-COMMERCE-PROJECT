import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Dummy data for the categories
const categories = [
  {
    id: 1,
    title: "Men's Collections",
    path:'men',
    description:
      "Step up your game with our rugged and stylish Men's Boots. Perfect for outdoor adventures or casual wear.",
    imgUrl:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1727187562/nermar_sekcpc.jpg", // Replace with relevant image
    hoverImgUrl:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1727187664/messi_ehxmyh.jpg", // Replace with relevant image
  },
  {
    id: 2,
    title: "Women's Collections",
    path:'women',
    description:
      "Discover our collection of Women's Boots that combine fashion and comfort, from chic ankle boots to tough hiking boots.",
    imgUrl: "https://res.cloudinary.com/dmrvutjac/image/upload/v1727187665/women1_z0p5e2.jpg", // Replace with relevant image
    hoverImgUrl: "https://res.cloudinary.com/dmrvutjac/image/upload/v1727187664/women2_mige6v.jpg", // Replace with relevant image
  },
  {
    id: 3,
    title: "Kids' Collections",
    path:'kids',
    description:
      "Keep the little ones ready for any adventure with our durable and playful Kids' Boots. Perfect for all-day fun.",
    imgUrl: "https://res.cloudinary.com/dmrvutjac/image/upload/v1727187663/kid1_nkekdt.jpg", // Replace with relevant image
    hoverImgUrl: "https://res.cloudinary.com/dmrvutjac/image/upload/v1727187664/kid2_fbnhvd.jpg", // Replace with relevant image
  },
];


const CategoryBanner = () => {

  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="py-12">
      {/* Stylish Heading */}
      <div className="flex flex-col lg:flex-row justify-between  items-center mb-10 px-4 text-center lg:text-left">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            SHOP <span className="text-gray-500">OUR PRODUCTS</span>
          </h2>
          <p className="text-base lg:text-lg text-gray-500 mt-3">
            Discover  perfect for every inspires
          </p>
        </div>
        {/* Arrow button with React Icon */}
        <button onClick={()=>navigate(`/shop`)}  className="flex items-center bg-blue-800 text-white px-4 mx-4 py-2 rounded-full shadow-lg hover:bg-blue-950 text-lg lg:text-2xl">
          Explore <FaArrowRight className="ml-2 " />
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative group ${
              hoveredId === category.id ? "scale-105" : "scale-100"
            } transform transition-transform ease-in-out duration-500`}
            onMouseEnter={() => setHoveredId(category.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={()=>navigate(`/${category?.path}`)}
          >
            <img
              src={
                hoveredId === category.id
                  ? category.hoverImgUrl
                  : category.imgUrl
              }
              alt={category.title}
              className={`w-full h-72 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg  `}
            />

            {/* Gradient overlay to dim the bottom */}
            <div className="absolute right-0 left-0 top-1/3 bottom-0 bg-gradient-to-t from-black   to-transparent rounded-lg"></div>
            <div className="absolute bottom-5 right-0 left-0 flex flex-col justify-end px-5 md:px-10">
              <div className="flex  justify-between items-center  w-full">
                <div>
                  {" "}
                  <h2 className="text-white text-xl md:text-xl lg:text-3xl font-bold  text-start space-y-5 ">
                    {category.title}
                  </h2>
                  <p className="text-white text-xs md:text-sm  text-start">
                    {category.description}
                  </p>
                </div>
                <button className=" px-4 py-2 lg:px-6 lg:py-3  text-white font-semibold  ">
                  <FaArrowRight className="ml-2 size-10 md:size-14 lg:size-16" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBanner;
