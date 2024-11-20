import { useEffect, useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
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
      console.error(err);
    }
  };

  return (
    <div
      className="relative rounded-lg hover:border-black hover:border transition-transform transform md:hover:scale-105 bg-white cursor-pointer w:1/2 md:w-56"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product-details?id=${product._id}`)}
    >
      {/* Image with hover effect */}
      <div className="relative w-full p-2 group">
  <div className="relative aspect-[4/5] w-full rounded-t-md overflow-hidden">
    {/* Default Image */}
    <img
      src={product.thumbnail}
      alt={product.productName}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
    />

    {/* Hover Image */}
    <img
      src={product.gallery[0]}
      alt={product.productName}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
    />
  </div>
</div>



      {/* Rating and Reviews */}
      <div className="flex items-center justify-center mt-1 text-xs">
        <FaStar className="text-yellow-400 mr-1" />
        <span className="font-semibold">4.4</span>
        <span className="text-gray-500 ml-1">| 1.3k</span>
      </div>

      {/* Product Details */}
      <div className="m-1 text-center">
        <h3 className="text-sm font-semibold truncate">
          {product.productName}
        </h3>
        <div className="text-gray-700 text-sm flex flex-col items-center justify-center">
          {product.offer &&
          new Date(product.offer?.endDate) >= Date.now() &&
          new Date(product.offer?.startDate) <= Date.now() ? (
            <>
              <div className="text-xl font-bold text-gray-800">
                ₹{product.offerPrice}
              </div>
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
          <FaHeart
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              toggleWishlist(product._id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired, // Product object prop
};

export default ProductCard;
