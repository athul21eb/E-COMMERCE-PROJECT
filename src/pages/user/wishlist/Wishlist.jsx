import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import WishlistItem from "../../../components/common/wishlistItem/WishlistItem";
import {
  useGetWishListQuery,
  useRemoveFromWishlistMutation,
} from "../../../slices/user/wishList/wishListApiSlice";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmptyAnimation from "../../../components/common/animations/EmptyCartAnimations";
import { Heart } from "lucide-react";
import { useAddToCartMutation } from "../../../slices/user/cart/cartApiSlice";
import { toast } from "react-toastify";

// Wishlist Component
const Wishlist = () => {
  const navigate = useNavigate();
  const [RemoveFromWishlistApiCall] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: addToCartLoading, isError }] =
    useAddToCartMutation();
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

  //// move to bag function

  ////Add to bag handle function
  const handleMoveToBag = async (id) => {
    try {
      // Find the product from wishlist items using the product id
      const product = wishlistItems.find((x) => x._id === id);

      // Filter to get sizes that are in stock (quantity > 0)
      const availableSize = product?.stock.reduce((max, current) => 
        current.stock > max.stock ? current : max
      );
      
      
      // If no available size found, show a message to the user
      if (!availableSize) {
        toast.error("Out of Stock for all sizes!");
        return;
      }

      // Proceed with adding the product to cart with the selected size
      const response = await addToCart({
        productId: id,
        quantity: 1,
        size: availableSize.size, // Pick the available size
      }).unwrap();

      // Refetch wishlist to reflect changes (e.g., if stock changes after adding to cart)

      toast.success(response.message);
      navigate("/cart");
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };
  ////--------------------------render component-----------------------------

  if (addToCartLoading) {
    return <LoadingFullScreen />;
  }
  return wishlistItems.length < 1 ? (
    <div className="mt-2 flex flex-col items-center justify-center h-screen">
      <EmptyAnimation
        icon={
          <Heart className="w-28 h-28 sm:w-32 sm:h-32 text-customColorTertiarypop fill-customColorTertiaryDark" />
        }
      />
      <h2 className="text-2xl font-semibold text-gray-700">
        Your Wishlist is Empty
      </h2>
      <p className="text-gray-500 mt-2 px-2 text-center">
        Once you add something to your wishlist - it will appear here. Ready to
        get started?
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
