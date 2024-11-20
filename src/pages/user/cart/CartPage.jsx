import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LiaShoppingBagSolid } from "react-icons/lia";
import CartItem from "../../../components/common/CartItem/CartItem";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { RiCoupon2Line } from "react-icons/ri";
import { calculateCartTotals } from "../../../utils/helper/helper";
import CustomModal from "../../../components/common/Modals/Modal";
import BlockModal from "../../../components/common/BlockModals/BlockModal";
import { toast } from "react-toastify";
import {
  useApplyCouponMutation,
  useGetCouponsQuery,
  useRemoveCouponMutation,
} from "../../../slices/user/coupons/couponsApiSlice";
import EmptyCartAnimation from "../../../components/common/animations/EmptyCartAnimations";
import { ShoppingCartIcon ,ShoppingBagIcon } from "lucide-react";

const Cart = () => {
  const { cartDetails } = useSelector((state) => state.cart);

  const { data: { coupons = [] } = {}, refetch } = useGetCouponsQuery();
  const [applyCouponApiCall] = useApplyCouponMutation();
  const [removeCouponApiCall] = useRemoveCouponMutation();

  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [apiCallLoading, setApiCallLoading] = useState(false);
  const [couponRemoveMode, setCouponRemoveMode] = useState(false);

  // Handle opening and closing modals
  const handleCouponsOpenModal = () => {
    setIsCouponsModalOpen(true);
  };

  const handleCouponsCloseModal = () => {
    setIsCouponsModalOpen(false);
    setCurrentCoupon(null);
  };

  useEffect(() => {
    refetch();
  }, [cartDetails]);
  const summary = useMemo(() => {
    if (!cartDetails?.items?.length) {
      return {
        totalItems: 0,
        cartTotal: 0,

        couponDiscount: 0,
        totalAmount: 0,
        totalMRP: 0,
        totalDiscount: 0, // No discount if cart is empty
      };
    }

    if (
      cartDetails?.appliedCoupon &&
      new Date(cartDetails?.appliedCoupon?.expirationDate) > new Date()
    ) {
      setCurrentCoupon(cartDetails?.appliedCoupon);
    } else {
      setCurrentCoupon(null);
    }

    const {
      totalQuantity,
      couponDiscount,
      totalAmount,
      cartTotal,
      totalDiscount,
      totalMRP,
    } = calculateCartTotals(cartDetails);

    // Calculate total amount

    return {
      totalItems: totalQuantity,
      cartTotal,

      totalAmount,
      totalDiscount, // Include total discount in the return value
      couponDiscount,
      totalMRP,
    };
  }, [cartDetails]);

  const handleCouponApplyConfirm = async () => {
    try {
      setApiCallLoading(true);

      if (!currentCoupon) {
        toast.warning("invalid Coupon");
        return;
      }

      if (currentCoupon.minPurchaseAmount > summary.cartTotal) {
        toast.warning(
          `coupon need minimum purchase Amount of ₹${currentCoupon.minPurchaseAmount}`
        );
        return;
      }

      console.log(currentCoupon.code);
      const response = await applyCouponApiCall({
        code: currentCoupon?.code,
      }).unwrap();

      toast.success(response?.message);
    } catch (err) {
      console.error("Error applying coupon:", err.error);
      toast.error(err?.data?.message || err.error);
    } finally {
      setApiCallLoading(false);
      setIsConfirmModalOpen(false);
      setIsCouponsModalOpen(false);
     
    }
  };

  //// remove Coupon
  const handleCouponRemove = async () => {
    try {
      setApiCallLoading(true);
      if (!currentCoupon) return;
      
      const response = await removeCouponApiCall().unwrap();

      toast.success(response?.message);
    } catch (err) {
      console.error("Error applying coupon:", err.error);
      toast.error(err?.data?.message || err.error);
    } finally {
      setApiCallLoading(false);
      setIsConfirmModalOpen(false);

      setTimeout(()=>{
        setCouponRemoveMode(false);
      },1000)
      
      
    }
  };

  return !cartDetails || cartDetails?.items.length === 0 ? (
    <div className="mt-2 flex flex-col items-center justify-center min-h-screen">
      <EmptyCartAnimation icon={ <ShoppingBagIcon className="w-28 h-28 sm:w-32 sm:h-32 text-customColorTertiarypop" />}/>
      <h2 className="text-2xl font-semibold text-gray-700">
        Your Bag is Empty
      </h2>
      <p className="text-gray-500 text-center mt-2">
        Once you add something to your bag - it will appear here.
      </p>
      <Link to="/shop">
        <button className="mt-6 px-6 py-2 bg-blue-500 bg-opacity-80 text-white text-lg rounded-lg hover:bg-blue-600">
          Shop Now 
        </button>
      </Link>
    </div>
  ) : (
    <div className="container mx-auto my-20 p-4">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <LiaShoppingBagSolid className="size-10 md:size-16 mr-2" />
        Your Cart
      </h1>
      <p className="text-sm md:text-lg text-gray-500 mb-4">
        Total {summary.totalItems} items in your cart
      </p>

      <div className="flex flex-col lg:flex-row gap-8 mx-auto">
        {/* Cart Items Section */}
        <div className="flex-grow w-full lg:w-7/12">
          {cartDetails &&
            cartDetails.items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
        </div>

        {/* Cart Summary Section */}
        <div className="w-full lg:w-5/12">
          {cartDetails?.appliedCoupon &&
          new Date(cartDetails.appliedCoupon.expirationDate) > new Date() ? (
            <div className="w-full  ">
              <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded flex items-center justify-between space-x-2">
                {cartDetails.appliedCoupon.discount}% OFF (Coupon Applied)
                <button
                  className="text-red-500 text-lg px-2 py-1  rounded hover:bg-red-100 flex items-center"
                  onClick={() => {
                    setCurrentCoupon(cartDetails.appliedCoupon);
                    setCouponRemoveMode(true);
                    setIsConfirmModalOpen(true);
                  }} // Add the remove handler here
                >
                  <AiOutlineClose /> {/* React icon for "X" */}
                </button>
              </span>
            </div>
          ) : (
            <div className="flex justify-start mx-auto mb-4">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RiCoupon2Line />}
                onClick={handleCouponsOpenModal}
              >
                Apply Coupons
              </Button>
            </div>
          )}

          <CartSummary {...summary} />
        </div>
      </div>
      {/* Coupons Modal */}
      <CustomModal
        isOpen={isCouponsModalOpen}
        onClose={handleCouponsCloseModal}
        title="Select a Coupon"
        footer={
          <Button
            variant="contained"
            color="primary"
            onClick={handleCouponsCloseModal}
          >
            Close
          </Button>
        }
        className="bg-white"
      >
        <div className="max-h-64 overflow-y-auto">
          <List className="space-y-2">
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <ListItem
                  key={coupon._id}
                  onClick={() => {
                    setCurrentCoupon(coupon);
                    setIsConfirmModalOpen(true);
                  }}
                  className="hover:bg-blue-100 hover:shadow-md hover:cursor-pointer transition-all rounded-md mb-1 p-2 border border-gray-200 flex items-center space-x-4"
                >
                  <ListItemIcon className="min-w-0">
                    <RiCoupon2Line className="text-red-500 text-lg" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        component="span"
                        className="font-semibold"
                      >
                        {coupon.code}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="subtitle2"
                          component="span"
                          className="font-bold text-red-500 mt-1 block"
                        >
                          {coupon.discount}% OFF
                        </Typography>

                        <Typography
                          variant="body2"
                          component="span"
                          className="text-gray-600 block"
                        >
                          On minPurchaseAmount of {coupon?.minPurchaseAmount}
                          <br /> (Upto ₹{coupon.maxDiscountAmount})
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body1"
                className="text-gray-600 text-center p-4"
              >
                No Coupons Available
              </Typography>
            )}
          </List>
        </div>
      </CustomModal>

      {/* Confirmation Modal */}
      {couponRemoveMode ? (
  <BlockModal
    open={isConfirmModalOpen}
    onClose={() => setIsConfirmModalOpen(false)}
    onConfirm={handleCouponRemove}
    message={`Are you sure you want to remove the coupon ${currentCoupon?.code} with ${currentCoupon?.discount}% OFF On minPurchaseAmount of ₹${currentCoupon?.minPurchaseAmount}
               (Upto ₹${currentCoupon?.maxDiscountAmount})?`}
    buttonName="Remove"
    loading={apiCallLoading}
  />
) : (
  <BlockModal
    open={isConfirmModalOpen}
    onClose={() => setIsConfirmModalOpen(false)}
    onConfirm={handleCouponApplyConfirm}
    message={`Are you sure you want to apply the coupon - ${currentCoupon?.code} with ${currentCoupon?.discount}% OFF On minPurchaseAmount of ₹${currentCoupon?.minPurchaseAmount}
               (Upto ₹${currentCoupon?.maxDiscountAmount})?`}
    buttonName="Apply"
    loading={apiCallLoading}
  />
)}

    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.any.isRequired, // Since item can be any type
};

export default Cart;

export const CartSummary = ({
  totalItems,
  cartTotal,
  couponDiscount,

  totalMRP,

  totalAmount,
  totalDiscount,
  cart = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-gray-100 rounded-lg border">
      <h3 className="text-lg md:text-2xl font-bold mb-4  ">Order Summary</h3>

      <div className="flex justify-between mb-2">
        <span>{totalItems}items (inc. all of taxes)</span>
        <span className="text-lg text-gray-500">
          ₹ {totalMRP.toLocaleString()}
        </span>
      </div>

      {/* Discount Section */}
      {totalDiscount !== 0 && (
        <div className="flex justify-between mb-2">
          <span>Offer Discount </span>
          <span className="text-lg text-green-500">
            - ₹ {totalDiscount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Coupon Section */}
      {couponDiscount !== 0 && (
        <div className="flex justify-between mb-2">
          <span> Coupon Discount </span>
          <span className="text-lg text-green-500">
            - ₹ {couponDiscount.toLocaleString()}
          </span>
        </div>
      )}
      <div className="flex justify-between mb-2">
        <span>Shipping Free</span>
        <span className="text-lg text-gray-500">₹ 0</span>
      </div>
      <div className="flex justify-between font-semibold text-lg my-2 border-t-2 border-black">
        <span className="text-xl">Total Amount</span>
        <span className="text-2xl">₹ {totalAmount.toLocaleString()}</span>
      </div>

      {cart && (
        <button
          onClick={() => navigate("/checkOut",{state:{from:"/cart"}})}
          className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg mt-4"
        >
          Checkout
        </button>
      )}
    </div>
  );
};

CartSummary.propTypes = {
  totalItems: PropTypes.number.isRequired,
  cartTotal: PropTypes.number.isRequired,

  totalAmount: PropTypes.number.isRequired,
  totalDiscount: PropTypes.number.isRequired,
  couponDiscount: PropTypes.number.isRequired,
  totalMRP: PropTypes.number.isRequired,
  isCart: PropTypes.bool,

  // New prop for discount
};
