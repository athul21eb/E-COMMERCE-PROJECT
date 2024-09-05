import { useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className=" rounded-lg hover: hover:border-black hover:border transition-transform transform hover:scale-105 cursor-pointer w-48" // Reduced the width
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product-details?id=${product._id}`)}
    >
      {/* Image with hover effect */}
      <div className="relative">
        <img
          src={isHovered ? product.gallery[0] : product.thumbnail}
          alt={product.productName}
          style={{
            height: 'calc(100% * 0.8)',
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
          className="w-full object-contain transition-opacity duration-500"
        />
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center justify-center mt-1 text-xs"> {/* Reduced margin and font size */}
        <FaStar className="text-yellow-400 mr-1" />
        <span className="font-semibold">4.4</span>
        <span className="text-gray-500 ml-1">| 1.3k</span> {/* Reduced margin */}
      </div>

      {/* Product Details */}
      <div className="m-1 text-center"> {/* Reduced margin */}
        <h3 className="text-sm font-semibold truncate">{product.productName}</h3> {/* Reduced font size */}
        <p className="text-gray-700 flex items-center justify-center text-sm"> {/* Reduced font size */}
          <BiRupee className="mr-1" />
          {product.salePrice}
        </p>

        {/* Favorite Icon */}
        <div className="absolute top-1 right-1 text-gray-600 hover:text-red-500 cursor-pointer"> {/* Adjusted position */}
          <FaHeart />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
