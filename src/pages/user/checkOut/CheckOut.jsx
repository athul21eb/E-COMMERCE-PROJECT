import React, { useState, useEffect, useMemo } from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaMobileAlt,
  FaMoneyBillWave,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { useSelector } from "react-redux";
import { replace, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCartQuery } from "../../../slices/user/cart/cartApiSlice";
import { useGetAddressesQuery } from "../../../slices/user/profile/address/addressApiSlice";
import { useCreateOrderMutation } from "../../../slices/user/orders/orderApiSlice";
import LoadingBlurScreen from '../../../components/common/LoadingScreens/LoadingBlurFullScreen'
import OrderCompletion from "../orderSuccesfull/OrderCompletion";
const CheckoutPage = () => {
 
  ////Rtk
  const { refetch } = useGetCartQuery();
  const { data } = useGetAddressesQuery();
  const [placeOrder, { isLoading }] = useCreateOrderMutation();

  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("PayOnDelivery");
  const { addresses } = useSelector((state) => state.userAddresses);
  const { cartDetails } = useSelector((state) => state.cart);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    if (addresses.length) {
      const findDefaultAddress = addresses.find(
        (address) => address.isDefaultAddress
      );
      if (findDefaultAddress) {
        setDefaultAddress(findDefaultAddress);
      }
    }
  }, [addresses]);


  

  const handlePaymentChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };
  /////delivery Date

  const deliveryDate = useMemo(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  /////order summary
  const orderSummary = useMemo(() => {
    if (cartDetails && !cartDetails?.items?.length) return {};

    const subtotal = cartDetails?.items.reduce(
      (total, item) => total + item.productId.salePrice * item.quantity,
      0
    );
    const deliveryFee = Math.ceil(subtotal * 0.03);

    const totalAmount = Math.ceil(subtotal + deliveryFee);

    return {
      itemsTotal: subtotal,
      deliveryFee,

      totalAmount,
    };
  }, [cartDetails]);

  const handlePlaceOrder = async () => {
    if (selectedPaymentMethod !== "PayOnDelivery") {
      return;
    }

    if(!cartDetails&&!cartDetails?.items.length){

      toast.error("Add products first and Place order");
      return ;
    }

    
    if(!defaultAddress){

      toast.error("Add Address first");
      return ;
    }

    try {
      const response = await placeOrder({
        items: cartDetails?.items,
        shippingAddress: defaultAddress,
        paymentMethod: selectedPaymentMethod,
        billAmount: orderSummary.totalAmount,
      }).unwrap();

      toast.success(response.message);
    setOrderPlaced(true);
    refetch();

    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }

    // Add order placement logic here
  };

  if(orderPlaced){

    return <OrderCompletion/>;
  }

  if(isLoading){
    return <LoadingBlurScreen/>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-200 shadow-lg rounded-lg">
   {/* Step Indicator */}
<div className="flex flex-col lg:flex-row justify-center mb-8">
  {/* Step 1: Checkout */}
  <div className="flex items-center">
    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
      1
    </div>
    <span className="ml-2 font-semibold text-blue-500">Checkout</span>
  </div>
  
  {/* Line separator (blue) */}
  <div className="hidden lg:block flex-1 h-px bg-blue-300 mx-4"></div>
  
  {/* Step 2: Address */}
  <div className="flex items-center mt-4 lg:mt-0">
    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
      2
    </div>
    <span className="ml-2 font-semibold text-gray-700">Address</span>
  </div>
  
  {/* Line separator (blue) */}
  <div className="hidden lg:block flex-1 h-px bg-blue-300 mx-4"></div>

  {/* Step 3: Payment */}
  <div className="flex items-center mt-4 lg:mt-0">
    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
      3
    </div>
    <span className="ml-2 font-semibold text-gray-700">Payment</span>
  </div>
  
  {/* Line separator (gray) */}
  <div className="hidden lg:block flex-1 h-px bg-gray-300 mx-4"></div>

  {/* Step 4: Place Order */}
  <div className="flex items-center mt-4 lg:mt-0">
    <div className="bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center">
      4
    </div>
    <span className="ml-2 font-semibold text-gray-700">Place Order</span>
  </div>
</div>


      <h1 className="text-3xl font-bold mb-8 text-start border-b-2 border-black">
        Checkout
      </h1>

      <div className="flex justify-between">
        <div className="w-2/3 pr-8">
          {/* Payment Method */}
          <div className="bg-white p-6 mb-8 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">
                <FaCreditCard className="text-blue-500" />
              </span>
              Payment Method
            </h2>
            <div className="space-y-4">
              {/* Credit/Debit Card Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="CreditCard"
                  name="paymentMethod"
                  value="CreditCard"
                  checked={selectedPaymentMethod === "CreditCard"}
                  onChange={handlePaymentChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <label
                  htmlFor="CreditCard"
                  className="ml-2 flex items-center text-sm cursor-pointer"
                >
                  <FaCcVisa className="mr-1 text-blue-500" />
                  <FaCcMastercard className="mr-1 text-orange-500" />
                  <FaCcAmex className="mr-1 text-blue-900" />
                  <FaCcDiscover className="mr-1 text-orange-700" />
                  Debit Card / Credit Card
                </label>
              </div>

              {/* UPI Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="UPI"
                  name="paymentMethod"
                  value="UPI"
                  checked={selectedPaymentMethod === "UPI"}
                  onChange={handlePaymentChange}
                  className="form-radio h-5 w-5 text-green-600"
                />
                <label
                  htmlFor="UPI"
                  className="ml-2 flex items-center text-sm cursor-pointer"
                >
                  <FaMobileAlt className="mr-2 text-green-500" />
                  UPI
                </label>
              </div>

              {/* Razorpay Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="Razorpay"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={selectedPaymentMethod === "Razorpay"}
                  onChange={handlePaymentChange}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <label
                  htmlFor="Razorpay"
                  className="ml-2 flex items-center text-sm cursor-pointer"
                >
                  <SiRazorpay className="mr-2 text-indigo-500" />
                  Razorpay
                </label>
              </div>

              {/* Cash on Delivery Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="PayOnDelivery"
                  name="paymentMethod"
                  value="PayOnDelivery"
                  checked={selectedPaymentMethod === "PayOnDelivery"}
                  onChange={handlePaymentChange}
                  className="form-radio h-5 w-5 text-gray-600"
                />
                <label
                  htmlFor="PayOnDelivery"
                  className="ml-2 flex items-center text-sm cursor-pointer"
                >
                  <FaMoneyBillWave className="mr-2 text-gray-500" />
                 Pay on Delivery
                </label>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 mb-8 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            {defaultAddress ? (
              <>
                <p className="text-sm bg-blue-100 inline-block px-2 py-1 rounded-full text-blue-600 mb-4">
                  Default
                </p>
                <p className="font-semibold text-gray-800 text-lg">{`${defaultAddress.firstName} ${defaultAddress.lastName}`}</p>
                <p className="text-gray-600">{`${defaultAddress.city},`}</p>
                <p className="text-gray-600">{`${defaultAddress.district}, ${defaultAddress.state} - ${defaultAddress.pincode}`}</p>
                <p className="text-gray-600">{defaultAddress.mobileNumber}</p>
              </>
            ) : (
              <p> please Add a Address ...</p>
            )}
            <button
              onClick={() => navigate("addresses")}
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
             { !defaultAddress ? "Add Address" :"Change Address"}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-1/3 bg-white p-6 shadow rounded-lg flex-col flex">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Items Total</span>
              <span>₹ {orderSummary.itemsTotal}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>₹ {orderSummary.deliveryFee}</span>
            </div>

            <div className="border-t border-gray-300 pt-4 flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹ {orderSummary.totalAmount}</span>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 flex items-center justify-center"
          >
            <FaCheckCircle className="mr-2" />
            Place Order
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 mt-8 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="grid grid-cols-3 gap-4">
          {cartDetails &&
            cartDetails?.items.map((product) => (
              <div key={product._id} className="text-center">
                <img
                  src={product.productId.thumbnail}
                  alt={product.productId.productName}
                  className="w-24 h-24 object-cover mx-auto mb-2 rounded-lg shadow-sm"
                />
                <p className="text-sm font-semibold">
                  {product.productId.productName}
                </p>
                <p className="text-sm text-gray-600">
                  {product.quantity} x ₹{product.productId.salePrice}
                </p>
              </div>
            ))}
        </div>
        <p className="text-blue-500 mt-4">
          {cartDetails?.items.length} Items Arrive by {deliveryDate}
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
