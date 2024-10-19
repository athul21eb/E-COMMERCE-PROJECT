import { useEffect, useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../../slices/user/wishList/wishListApiSlice";

const ProductCard = ({ product }) => {
  const [AddToWishlistApiCall] = useAddToWishlistMutation();
  const [RemoveFromWishlistApiCall] = useRemoveFromWishlistMutation();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { wishListDetails } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.auth?.authInfo.user);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (wishListDetails) {
      setInWishlist(
        wishListDetails?.products?.some((item) => item._id === product._id)
      );
    }
  }, [wishListDetails]);

  const toggleWishlist = async (productId) => {
    try {
      if (!user) {
        return navigate("/login");
      }
      if (inWishlist) {
        await RemoveFromWishlistApiCall({ productId }).unwrap();
      } else {
        await AddToWishlistApiCall({ productId }).unwrap();
      }
    } catch (err) {
      // Display error message in case of failure

      console.error(err);
    }
  };
  return (
    <div
      className="  rounded-lg hover: hover:border-black hover:border transition-transform transform hover:scale-105 bg-white  cursor-pointer w:1/2 md:w-56" // Reduced the width
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product-details?id=${product._id}`)}
    >
      {/* Image with hover effect */}
      <div className="relative rounded-lg p-2">
        <img
          src={isHovered ? product.gallery[0] : product.thumbnail}
          alt={product.productName}
          style={{
            height: "calc(100% * 0.8)",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
          className="w-full object-contain transition-opacity duration-500"
        />
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center justify-center mt-1 text-xs">
        {" "}
        {/* Reduced margin and font size */}
        <FaStar className="text-yellow-400 mr-1" />
        <span className="font-semibold">4.4</span>
        <span className="text-gray-500 ml-1">| 1.3k</span>{" "}
        {/* Reduced margin */}
      </div>

      {/* Product Details */}
      <div className="m-1 text-center">
        {" "}
        {/* Reduced margin */}
        <h3 className="text-sm font-semibold truncate">
          {product.productName}
        </h3>{" "}
        {/* Reduced font size */}
        <div className="text-gray-700 text-sm flex flex-col items-center justify-center">
  {/* Display Rupee icon */}
 

  {/* Check if there's an active offer with a valid end date */}
  {product.offer && new Date(product.offer?.endDate) >= Date.now() &&new Date(product.offer?.startDate) <= Date.now() ? (
    <>
      {/* First row: Offer Price (larger and standalone) */}
      <div className="text-xl font-bold text-gray-800">
        ₹{product.offerPrice}
      </div>
      
      {/* Second row: Sale Price (strike-through) and Discount Percentage */}
      <div className="flex items-center space-x-2">
        <span className="text-base text-red-500 font-medium line-through">
          (₹{product.salePrice})
        </span>
        <span className="text-sm text-green-600 font-bold">
          {product.offer?.discountPercentage}% OFF
        </span>
      </div>
    </>
  ) : (
    /* When no offer or offer expired: Only Sale Price displayed */
    <div className="text-xl font-bold text-gray-800">
      ₹{product.salePrice}
    </div>
  )}
</div>


        {/* Favorite Icon */}
        <div
          className={`absolute top-1 right-1 cursor-pointer ${
            inWishlist ? "text-red-500" : "text-gray-600"
          }`}
        >
          {" "}
          {/* Adjusted position */}
          <FaHeart
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              toggleWishlist(product._id); // Call the delete handler
            }}
          />
        </div>
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

ProductCard.propTypes = {
  product: PropTypes.any.isRequired, // Product object prop
};

export default ProductCard;
