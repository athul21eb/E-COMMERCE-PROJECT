import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import PropTypes from 'prop-types';

const WishlistItem = ({ product, onDelete, onMoveToBag }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="border rounded-lg hover:shadow-lg transition-transform transform hover:scale-105 bg-white cursor-pointer w-full sm:w-auto mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div
        className="relative p-2"
        onClick={() => navigate(`/product-details?id=${product._id}`)}
      >
        <img
          src={!isHovered ? product.thumbnail : product.gallery[0]}
          alt={product.productName}
          className="w-full object-contain h-40 sm:h-48 md:h-56 lg:h-64 rounded-lg"
        />
        {/* Delete Icon */}
        <div
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            onDelete(product._id); // Call the delete handler
          }}
        >
          <MdDeleteForever size={24} className="text-red-500 hover:text-red-700" />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-2 text-center">
        <h3 className="text-sm md:text-md font-semibold truncate">
          {product?.productName}
        </h3>
        <div className="flex flex-col items-center justify-center text-gray-700">
          {/* Display Offer Information */}
          {product.offer &&
          new Date(product.offer?.endDate) >= Date.now() &&
          new Date(product.offer?.startDate) <= Date.now() ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm md:text-base text-red-500 font-medium line-through">
                  ₹{product.salePrice}
                </span>
                <span className="text-sm md:text-base text-green-600 font-bold">
                  {product.offer?.discountPercentage}% OFF
                </span>
              </div>
              <div className="text-lg md:text-xl font-bold text-gray-800">
                ₹{product.offerPrice}
              </div>
            </>
          ) : (
            <div className="text-lg md:text-xl font-bold text-gray-800">
              ₹{product.salePrice}
            </div>
          )}
        </div>
        <button
          className="bg-blue-500 text-white text-sm px-2 py-1 md:px-4 md:py-2 rounded-md mt-2 hover:bg-blue-600"
          onClick={() => onMoveToBag(product._id)}
        >
          Move to Bag
        </button>
      </div>
    </div>
  );
};

WishlistItem.propTypes = {
  product: PropTypes.any.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMoveToBag: PropTypes.func, // Optional prop
};

export default WishlistItem;
