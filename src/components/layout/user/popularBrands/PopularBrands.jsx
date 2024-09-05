import React, { useEffect, useState } from "react";
import { useLazyGetAllBrandsListQuery } from "../../../../slices/public/PublicApiSlice";
import { toast } from "react-toastify";
import LoadingBlurScreen from "../../../common/LoadingScreens/LoadingBlurFullScreen";

const PopularBrands = () => {
  const [triggerBrandsList, { isLoading }] = useLazyGetAllBrandsListQuery();
  const [brandDetails, setBrandDetails] = useState([]);

  const fetchingAllBrands = async () => {
    try {
      const response = await triggerBrandsList().unwrap();
      if (response) {
        const { brands } = response;
        setBrandDetails(brands);
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
    return <LoadingBlurScreen />;
  }

  return (
    <div className="mx-auto my-5 max-w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Popular Brands</h2>
        <button className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-8 sm:w-8"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-x-4 gap-y-6 w-full">
        {brandDetails.map((brand, index) => (
          <div
            key={index}
            className="flex border border-gray-300 rounded-full items-center justify-center w-full h-auto"
          >
            <img
              src={brand?.brandPhotoUrl}
              alt={brand?.brandName || `Brand ${index + 1}`}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PopularBrands);
