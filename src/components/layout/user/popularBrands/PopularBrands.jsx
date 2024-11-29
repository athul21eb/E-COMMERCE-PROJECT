import React, { useEffect, useState } from "react";
import { useLazyGetAllBrandsListQuery } from "../../../../slices/public/PublicApiSlice";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import LoadingFullScreen from "../../../common/LoadingScreens/LoadingFullScreen";

const PopularBrands = () => {

  const navigate = useNavigate();
  const [triggerBrandsList, { isLoading }] = useLazyGetAllBrandsListQuery();
  const [brandDetails, setBrandDetails] = useState([]);

  const fetchingAllBrands = async () => {
    try {
      const response = await triggerBrandsList().unwrap();
      if (response) {
        const { brands } = response;
        setBrandDetails(brands.slice(0, 7)); // Show only the first 7 brands
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchingAllBrands();
  }, []);

  if (isLoading) {
    return <LoadingFullScreen />;
  }
  if(brandDetails?.length===0){
    return ;
  }

  return (
    <div className="mx-auto my-5 max-w-full px-4 hidden sm:block sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
          Our <span className="text-gray-500"> Partners</span>
          </h2>
        <button className="text-primary-500 hover:text-primary-700 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Brand Images */}
      <div className="grid grid-cols-7 gap-4  ">
        {brandDetails.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center border border-gray-200 rounded-full shadow-sm p-4 bg-white transition-transform hover:scale-105"
         onClick={()=>navigate(`/shop?search=${brand.brandName}`,{state:{brandName:brand?.brandName}})}
         >
            <img
              src={brand?.brandPhotoUrl}
              alt={brand?.brandName || `Brand ${index + 1}`}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PopularBrands);
