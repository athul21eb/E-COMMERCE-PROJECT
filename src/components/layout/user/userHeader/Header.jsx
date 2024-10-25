import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useLazyGetCartQuery } from "../../../../slices/user/cart/cartApiSlice";
import { useLazyGetWishListQuery } from "../../../../slices/user/wishList/wishListApiSlice";

const BagButton = ({ itemCount = 0 }) => {
  return (
    <button className="relative hover:text-gray-500 hover:underline cursor-pointer flex flex-col items-center">
      <IoBagOutline className="size-7 md:size-auto" />
      {itemCount > 0 && (
        <span className="absolute top-auto right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
          {itemCount}
        </span>
      )}
      <span className="hidden md:block text-sm">Bag</span>
    </button>
  );
};

const Header = () => {
  const [fetchWishlist, { isLoading: wishListLoading }] =
    useLazyGetWishListQuery();
  const [fetchCart, { isLoading: CartLoading }] = useLazyGetCartQuery();
  const user = useSelector((state) => state.auth?.authInfo.user);
  const cart = useSelector((state) => state.cart.cartDetails);
  const location = useLocation();
  useEffect(() => {
    if (user?.role) {
      fetchWishlist();
      fetchCart();
    }
  }, [user?.role, fetchCart, fetchWishlist]);

  //refetching the cart data
  useEffect(() => {
    // Refetch the cart when the location changes to '/cart' or '/checkout'
    if (location.pathname === "/cart" || location.pathname === "/checkout") {
      fetchCart(); // Call fetchCart again to refetch the cart
    }
  }, [location.pathname]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  ////--------------------------RENDER COMPONENT-----------

  if (wishListLoading || CartLoading) {
    return <LoadingFullScreen />;
  }

  return (
    <header className="bg-white h-16 shadow-md fixed w-full z-10 top-0">
      <nav className="flex items-center justify-between px-6 py-3">
        <div id="logo">
          <Link to="/" className="h-10 w-12">
            <img
              src="https://res.cloudinary.com/dmrvutjac/image/upload/v1725459108/userProfiles/liv97lcag234dudyxpro.png"
              alt="Fire LOGO"
              className="w-32 object-contain"
            />
          </Link>
        </div>

        <div id="NavButton" className="flex items-center justify-between">
          <div className="hidden lg:flex space-x-8 text-black text-lg font-medium">
            <Link to={"shop"}>
              <button className="hover:text-gray-500 hover:underline cursor-pointer">
                SHOP ALL
              </button>
            </Link>
            <Link to={"men"}>
              <button className="hover:text-gray-500 hover:underline cursor-pointer">
                MEN
              </button>
            </Link>
            <Link to={"women"}>
              <button className="hover:text-gray-500 hover:underline cursor-pointer">
                WOMEN
              </button>
            </Link>
            <Link to={"kids"}>
              <button className="hover:text-gray-500 hover:underline cursor-pointer">
                KIDS
              </button>
            </Link>
          </div>

          <div className="hidden md:flex mx-8 relative">
            <form onSubmit={handleSubmit} className="w-full md:w-auto">
              <input
                type="text"
                placeholder="What you looking for ?"
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none ring-gray-300 focus:ring-2 focus:ring-gray-500 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hidden"></button>
            </form>
            <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <div className="flex space-x-8 text-black text-lg font-medium">
            <Link to={user?.isVerified ? "account" : "login"}>
              <button className="hover:text-gray-500 hover:underline cursor-pointer flex flex-col items-center">
                <GoPerson className="size-7 md:size-auto" />
                <span className="hidden md:block text-sm">Profile</span>
              </button>
            </Link>
            <Link to={user?.isVerified ? "wishlist" : "login"}>
              <button className="hover:text-gray-500 hover:underline cursor-pointer flex flex-col items-center">
                <CiHeart className="size-7 md:size-auto" />
                <span className="hidden md:block text-sm">Wishlist</span>
              </button>
            </Link>
            <Link to={user?.isVerified ? "cart" : "login"}>
              <BagButton itemCount={cart && cart?.items.length} />
            </Link>
          </div>
        </div>

        {/* Toggle button for menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-black"
        >
          {menuOpen ? (
            <AiOutlineClose className="w-6 h-6" />
          ) : (
            <AiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Sidebar for small screens */}
      {menuOpen && (
        <div className="fixed inset-y-0 right-0 w-3/4 bg-white shadow-lg z-20 p-6 lg:hidden transition-transform duration-300 ease-in-out transform translate-x-0">
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-black"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="mt-8 mb-6">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setMenuOpen(false);
              }}
              className="w-full"
            >
              <input
                type="text"
                placeholder="What you looking for?"
                className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hidden"></button>
            </form>
          </div>

          {/* Menu items */}
          <div className="space-y-4">
            <Link to={"shop"}>
              <button
                onClick={() => setMenuOpen(false)}
                className="hover:text-gray-500 hover:underline block w-full text-left"
              >
                SHOP ALL
              </button>
            </Link>
            <Link to={"men"}>
              <button
                onClick={() => setMenuOpen(false)}
                className="hover:text-gray-500 hover:underline block w-full text-left"
              >
                MEN
              </button>
            </Link>
            <Link to={"women"}>
              <button
                onClick={() => setMenuOpen(false)}
                className="hover:text-gray-500 hover:underline block w-full text-left"
              >
                WOMEN
              </button>
            </Link>
            <Link to={"kids"}>
              <button
                onClick={() => setMenuOpen(false)}
                className="hover:text-gray-500 hover:underline block w-full text-left"
              >
                KIDS
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

import PropTypes from "prop-types";
import LoadingFullScreen from "../../../common/LoadingScreens/LoadingFullScreen";

BagButton.propTypes = {
  itemCount: PropTypes.number, // The number of items in the bag, defaults to 0
};

export default Header;
