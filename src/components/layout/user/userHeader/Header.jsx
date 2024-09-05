import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useGetCartQuery, useLazyGetCartQuery } from "../../../../slices/user/cart/cartApiSlice";
import { useLazyGetAllProductListQuery } from "../../../../slices/public/PublicApiSlice";





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


  const [refetch] = useLazyGetCartQuery();
  const user = useSelector((state) => state.auth?.authInfo.user);
  const cart = useSelector((state) => state.cart.cartDetails);
  const [triggerProductList] = useLazyGetAllProductListQuery();
  useEffect(() => {
    triggerProductList();
  }, [triggerProductList]);

  useEffect(() => {
    if (user?.role) {
      refetch();
    }
  }, [user?.role, refetch]);

  const [menuOpen, setMenuOpen] = useState(false);
  return (
<header className="bg-white h-16 shadow-md fixed w-full  z-10 top-0">

      <nav className="flex items-center justify-between px-6 py-3">
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
        <div id="logo" >
          <Link to="/" className=" h-10 w-12 ">
            <img
              src="https://res.cloudinary.com/dmrvutjac/image/upload/v1725459108/userProfiles/liv97lcag234dudyxpro.png"
              alt="Fire LOGO"
              className="  w-32  object-contain"
            />
          </Link>
        </div>
        <div id="NavButton" className="flex  items-center justify-between">
          <div
            id="categories"
            className="  space-x-8 text-black text-lg font-medium hidden lg:flex transition-opacity duration-900 ease-in-out opacity-0 lg:opacity-100"
          >
             <button className="hover:text-gray-500 hover:underline  cursor-pointer">
             SHOP ALL
            </button>
            <button className="hover:text-gray-500 hover:underline  cursor-pointer">
              MEN
            </button>
            <button className="hover:text-gray-500 hover:underline  cursor-pointer">
              WOMEN
            </button>
            <button className="hover:text-gray-500 hover:underline  cursor-pointer">
              KIDS
            </button>
          </div>
          <div id="searchBar" className="hidden md:flex mx-8 relative ">
  <input
    type="text"
    placeholder="What you looking for ?"
    className="w-full md:w-auto  px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none ring-gray-300 focus:ring-2 focus:ring-gray-500 pr-10"
  />
  <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
</div>

          <div className="utilities flex space-x-8 text-black text-lg font-medium">
       <Link to={user?.isVerified?'account':'login'}>     <button className="hover:text-gray-500 hover:underline cursor-pointer flex flex-col items-center">
              <GoPerson className="size-7 md:size-auto "/>
              <span className="hidden md:block text-sm">Profile</span>
            </button>
            </Link>
            <button className="hover:text-gray-500  hover:underline cursor-pointer flex flex-col items-center">
              <CiHeart className="size-7 md:size-auto" />
              <span className="hidden md:block text-sm">Wishlist</span>
            </button>
            <Link to={user?.isVerified?'cart':'login'}> 
          
              <BagButton  itemCount={cart&&cart?.items.length}/>
            
          
            </Link>
          
          </div>
        </div>
      </nav>
      {/* Dropdown menu for medium screens */}
      {menuOpen && (
        <div className="md:hidden px-10 py-2 space-y-2  flex flex-col justify-between items-start">
           <button className="hover:text-gray-500 hover:underline cursor-pointer">
          SHOP ALL
          </button>
          <button className="hover:text-gray-500 hover:underline cursor-pointer">
            MEN
          </button>
          <button className="hover:text-gray-500 hover:underline cursor-pointer">
            WOMEN
          </button>
          <button className="hover:text-gray-500 hover:underline cursor-pointer">
            KIDS
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;


