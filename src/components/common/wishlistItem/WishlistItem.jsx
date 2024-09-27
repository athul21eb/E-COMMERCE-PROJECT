// Individual Product Card for Wishlist

import { FaTrash } from 'react-icons/fa';
import { BiRupee } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdDeleteForever } from "react-icons/md";


const WishlistItem = ({ product, onDelete ,onMoveToBag}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
  
    return (
      <div
        className="border rounded-lg hover:shadow-lg transition-transform transform hover:scale-105 bg-white cursor-pointer   md:w-64 mx-4 mb-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative p-2" onClick={() => navigate(`/product-details?id=${product._id}`)}>
          <img
            src={!isHovered ? product.thumbnail : product.gallery[0]}
            alt={product.productName}
            className="w-full  object-contain rounded-lg"
          />
          {/* Delete Icon */}
          <div
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              onDelete(product._id); // Call the delete handler
            }}
          >
            <MdDeleteForever size={20} className="text-red-500 size-6 hover:text-red-700" />
          </div>
        </div>
  
        {/* Product Details */}
        <div className="p-2 text-center">
          <h3 className="text-md font-semibold truncate">{product?.productName}</h3>
          <p className="flex items-center justify-center text-gray-700">
            <BiRupee className="mr-1" /> {product?.salePrice}
          </p>
          {/* <button
            className="bg-blue-500 text-white text-sm px-4 py-1 rounded-md mt-2 hover:bg-blue-600"
            onClick={() => onMoveToBag(product._id)}
          >
            Move to Bag
          </button> */}
        </div>
      </div>
    );
  };
  

  export default WishlistItem