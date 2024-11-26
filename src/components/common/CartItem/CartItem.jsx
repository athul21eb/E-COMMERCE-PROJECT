import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import { LiaShoppingBagSolid } from "react-icons/lia";

import {
  useLazyGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateToCartMutation,
} from "../../../slices/user/cart/cartApiSlice";
import { toast } from "react-toastify";

const CartItem = ({ item }) => {
  ////mutations
  const navigate = useNavigate();
  const [updateCartProduct] = useUpdateToCartMutation();
  const [removeItemFromCart] = useRemoveFromCartMutation();
  const [selectedSize, setSelectedSize] = useState(item.size);
  const [availableStock, setAvailableStock] = useState(0);
  const [quantity, setQuantity] = useState(item.quantity);

  // Update the available stock when the selected size changes
  useEffect(() => {
    const sizeStock = item.productId.stock.find((s) => s.size === selectedSize);
    if (sizeStock) {
      setAvailableStock(sizeStock.stock);
    }
    setQuantity(item.quantity);
  }, [selectedSize, item.productId.stock, item.quantity]);

  const handleSizeChange = async (newSize) => {
    try {
      await updateCartProduct({
        data: { size: newSize, quantity: quantity },
        itemId: item._id,
      }).unwrap();
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  const handleQuantityChange = async (e) => {
    try {
      setQuantity(parseInt(e.target.value));

      await updateCartProduct({
        data: { size: selectedSize, quantity: parseInt(e.target.value) },
        itemId: item._id,
      }).unwrap();
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  const handleRemoveItemFromCart = async (itemId) => {
    try {
      const response = await removeItemFromCart({ itemId }).unwrap();
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4">
      <div
        onClick={() => navigate(`/product-details?id=${item.productId._id}`)}
        className="flex items-center cursor-pointer"
      >
        <img
          src={item.productId.thumbnail}
          alt={item.productId.productName}
          className="w-20 h-20 object-cover"
        />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">
            {item.productId.brand.brandName}
          </h2>
          <p className="text-lg text-gray-500">{item.productId.productName}</p>
          <div className="text-xl font-bold">
            {item.productId.offer &&
            item.productId.offer.startDate &&
            item.productId.offer.endDate &&
            new Date(item.productId.offer.startDate) <= new Date() &&
            new Date(item.productId.offer.endDate) >= new Date() ? (
              <>
                <div className="text-xl font-bold text-gray-800">
                  ₹{item.productId.offerPrice}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-base text-red-500 font-medium line-through">
                    (₹{item.productId.salePrice})
                  </span>
                  <span className="text-sm text-green-600 font-bold">
                    {item.productId.offer?.discountPercentage}% OFF
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-800">
                ₹{item.productId.salePrice}
              </div>
            )}
            11
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center mt-2"
          >
            <label className="mr-2">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => {
                const newSize = e.target.value;
                setSelectedSize(newSize);
                handleSizeChange(newSize);
              }}
              className="border p-1"
            >
              {item.productId.stock
                .filter((s) => s.stock !== 0)
                .map((s) => (
                  <option key={s._id} value={s.size}>
                    {s.size}
                  </option>
                ))}
            </select>

            <label className="ml-4 mr-2">Qty:</label>
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="border p-1"
            >
              {[...Array(Math.min(5, availableStock)).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {availableStock < 15 && (
              <span className="ml-4 text-red-500">
                only{availableStock} left!
              </span>
            )}
          </div>
        </div>
      </div>
      <button onClick={() => handleRemoveItemFromCart(item._id)}>
        <MdDeleteForever className="text-red-500 size-6 hover:text-red-700" />
      </button>
    </div>
  );
};

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

CartItem.propTypes = {
  item: PropTypes.any.isRequired,
};

export default CartItem;
