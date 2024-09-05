import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { LiaShoppingBagSolid } from "react-icons/lia";
import CartItem from "../../../components/common/CartItem/CartItem";

import { Link, useNavigate } from "react-router-dom";

const CartSummary = ({
  totalItems,
  subtotal,
  deliveryFee,
  // gstAmount,
  // discount,
  totalAmount,
}) => {
  const navigate = useNavigate();
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="flex justify-between mb-2">
        <span>{totalItems} items</span>
        <span className="text-lg text-gray-500">
          ₹ {subtotal.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Delivery Fee</span>
        <span className="text-lg text-gray-500">
          ₹ {deliveryFee.toLocaleString()}
        </span>
      </div>
      {/* <div className="flex justify-between mb-2">
        <span>GST Amount</span>
        <span>₹ {gstAmount.toLocaleString()}</span>
      </div> */}
      {/* <div className="flex justify-between mb-2">
        <span>Discount 30%</span>
        <span>- ₹ {discount.toLocaleString()}</span>
      </div> */}
      <div className="flex justify-between font-semibold text-lg my-2 border-t-2 border-black">
        <span className="text-xl">Total Amount</span>
        <span className="text-2xl">₹ {totalAmount.toLocaleString()}</span>
      </div>
      <input
        type="text"
        placeholder="Enter Coupon Code (optional)"
        className="w-full p-2 border rounded-lg mt-4"
      />
      <button
        onClick={() => navigate("/checkOut")}
        className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg mt-4"
      >
        Checkout
      </button>
    </div>
  );
};

const Cart = () => {
  const { cartDetails } = useSelector((state) => state.cart);

  const summary = useMemo(() => {
    if (!cartDetails?.items?.length) {
      return {
        totalItems: 0,
        subtotal: 0,
        deliveryFee: 0,
        // gstAmount: 0,
        totalAmount: 0,
      };
    }

    // Calculate subtotal by summing up the salePrice * quantity for each item
    const subtotal = cartDetails.items.reduce(
      (total, item) => total + item.productId.salePrice * item.quantity,
      0
    );

    const deliveryFee = Math.ceil(subtotal * 0.03); // Assuming 5% of subtotal as delivery fee
    // const gstAmount = subtotal * 0.18; // Assuming 18% GST

    // Total amount (including delivery fee and GST)
    const totalAmount = Math.ceil(subtotal + deliveryFee);

    return {
      totalItems: cartDetails.items.length,
      subtotal,
      deliveryFee,
      // gstAmount,
      totalAmount,
    };
  }, [cartDetails]);

  return !cartDetails || cartDetails?.items.length === 0 ? (
    <div className="mt-2 flex flex-col items-center justify-center h-screen">
      <LiaShoppingBagSolid size={100} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700">
        Your Bag is Empty
      </h2>
      <p className="text-gray-500 mt-2">
        Once you add something to your bag - it will appear here. Ready to get
        started? Get started
      </p>
      <Link to="/">
        <button className="mt-6 px-6 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Get Started
        </button>
      </Link>
    </div>
  ) : (
    <div className="container mx-auto  my-20 p-4">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <LiaShoppingBagSolid className="size-10 mr-2" />
        Your Cart
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Total {summary.totalItems} items in your cart
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {cartDetails &&
            cartDetails.items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
        </div>

        <div className="lg:w-1/3">
          <CartSummary {...summary} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
