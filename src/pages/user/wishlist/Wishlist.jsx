import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import WishlistItem from "../../../components/common/wishlistItem/WishlistItem";
import {
  useGetWishListQuery,
  useRemoveFromWishlistMutation,
} from "../../../slices/user/wishList/wishListApiSlice";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Wishlist Component
const Wishlist = () => {
  const [RemoveFromWishlistApiCall] = useRemoveFromWishlistMutation();

  const { wishListDetails } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (wishListDetails) {
      setWishlistItems(wishListDetails?.products);
    }
  }, [wishListDetails]);

  // Dummy wishlist data
  const [wishlistItems, setWishlistItems] = useState([]);

  // Handler to delete an item from the wishlist
  const handleDelete = async (productId) => {
    try {
      await RemoveFromWishlistApiCall({ productId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };
  const handleMoveToBag = (id) => {};

  return wishlistItems.length < 1 ? (
    <div className="mt-2 flex flex-col items-center justify-center h-screen">
      <FaHeart size={100} className="text-red-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700">
        Your Wishlist is Empty
      </h2>
      <p className="text-gray-500 mt-2">
        Once you add something to your wishlist - it will appear here. Ready to
        get started? Get started
      </p>
      <Link to="/">
        <button className="mt-6 px-6 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Get Started
        </button>
      </Link>
    </div>
  ) : (
    <div className="p-10">
      <h2 className="text-xl md:text-3xl font-semibold mb-4">
        My Wishlist {wishlistItems.length} items
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
        {wishlistItems.map((product) => (
          <WishlistItem
            key={product._id}
            product={product}
            onDelete={handleDelete}
            onMoveToBag={handleMoveToBag}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
