import React, { useState, useEffect, useMemo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import {motion} from 'framer-motion'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCartQuery } from "../../../slices/user/cart/cartApiSlice";
import { useGetAddressesQuery } from "../../../slices/user/profile/address/addressApiSlice";
import { useCreateOrderMutation, useVerifyPaymentMutation } from "../../../slices/user/orders/orderApiSlice";
import LoadingBlurScreen from "../../../components/common/LoadingScreens/LoadingBlurFullScreen";
import OrderCompletion from "../orderSuccesfull/OrderCompletion";
import { CartSummary } from "../cart/CartPage";
import { calculateCartTotals } from "../../../utils/helper/helper";
import PaymentMethod from "../../../components/layout/user/paymentComponent/PaymentComponent";
import LoadingButton from "../../../components/common/LoadingButtons/LoadingButton";

const CheckoutPage = () => {

  const { currentData,refetch:refetchWallet} = useGetWalletDetailsQuery({page:1,limit:1});
  const { refetch } = useGetCartQuery();
  const { refetch:refetchAddress} = useGetAddressesQuery();
  const [placeOrder, { isLoading  }] = useCreateOrderMutation();
  const [verifyPayment,{isLoading:isLoadingVerifyPayment}] = useVerifyPaymentMutation();

  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("");
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


  useEffect(()=>{

    window.scrollTo(0, 0,{behavior: "smooth"} );
    refetch();
    refetchWallet();
    refetchAddress();

  },[])
  // const deliveryDate = useMemo(() => {
  //   const currentDate = new Date();
  //   currentDate.setDate(currentDate.getDate() + 7);
  //   return currentDate.toLocaleDateString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // }, []);

  const summary = useMemo(() => {
    if (!cartDetails?.items?.length) {
      return {
        totalItems: 0,
        cartTotal: 0,
        cart: false,
        couponDiscount: 0,
        totalAmount: 0,
        totalMRP: 0,
        totalDiscount: 0,
      };
    }

    const {
      totalQuantity,
      couponDiscount,
      totalAmount,
      cartTotal,
      totalDiscount,
      totalMRP,
    } = calculateCartTotals(cartDetails);

    return {
      totalItems: totalQuantity,
      cartTotal,
      cart: false,
      totalAmount,
      totalDiscount,
      couponDiscount,
      totalMRP,
    };
  }, [cartDetails]);

  const handlePlaceOrder = async () => {
    if (!cartDetails?.items.length) {
      toast.error("Add products first and place an order");
      return;
    }

    if (!defaultAddress) {
      toast.warning("please Provide the delivery Address");
      return;
    }
    if(!["PayOnDelivery","RazorPay","Wallet"].includes(selectedPaymentMethod)){

      toast.warning("Please select the Payment Option ");
      return;
    }

   

    try {

      const response = await placeOrder({
        shippingAddress: defaultAddress,
        paymentMethod: selectedPaymentMethod,
      }).unwrap();

      if (selectedPaymentMethod === "PayOnDelivery") {
        

        toast.success(response.message);
        setOrderPlaced(true);
        refetch();
      }else if(selectedPaymentMethod==="RazorPay"){

        loadRazorPayCheckout(response)

      }else if(selectedPaymentMethod==="Wallet"){

        toast.success(response.message);
        setOrderPlaced(true);
        refetch();

      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  if (!orderPlaced && cartDetails?.items.length === 0) {
    return navigate("/cart");
  }

  if (orderPlaced) {
    return <OrderCompletion />;
  }

  

  /////razor pay functions
  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

async function loadRazorPayCheckout(orderData) {
    try {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res) {
            toast.error('Failed to load payment page please try again later')
            return
        }
        const options = {
            "key": import.meta.env.VITE_RAZORPAY_KEY_ID,
            "amount": orderData.amount,
            "currency": "INR",
            "name": "FIRE BOOTS",
            "description": "Proceed with your suitable payment",
            "image": "https://res.cloudinary.com/dmrvutjac/image/upload/v1725459108/userProfiles/liv97lcag234dudyxpro.png",
            "order_id": orderData.id,
            handler: function (res) {
                handlePaymentResponse(res)
            },
            "notes": {
                "address": "The FIRE BOOTS Store  Office"
            },
            "theme": {
                "color": "#FFFFFF"
            }
        }
        const razorpay = new window.Razorpay(options)
        razorpay.on('payment.failed', (res) => {
            handlePaymentResponse(res)
        })
        razorpay.open()

    } catch (error) {
     
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }

}
async function handlePaymentResponse(paymentDetails) {
    try {
        const res = await verifyPayment(paymentDetails).unwrap()
toast.success("Order placed successfully with RazorPay");
        setOrderPlaced(true);
        refetch();
        
        
    } catch (error) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
}

////----------------------component render---------------------------
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-gray-200 shadow-lg rounded-lg mb-10"
  >
    {/* Step Indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="hidden md:flex flex-row justify-center mb-8"
    >
      <StepIndicator step="1" label="Checkout" isActive />
      <StepSeparator isActive={!!defaultAddress}/>
      <StepIndicator step="2" label="Address" isActive={!!defaultAddress} />
      <StepSeparator />
      <StepIndicator step="3" label="Payment" />
      <StepSeparator />
      <StepIndicator step="4" label="Place Order" isLast />
    </motion.div>

    <h1 className="text-3xl font-bold mb-8 text-start border-b-2 border-black">
      Checkout
    </h1>

    <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
      <div className="md:w-1/2 pr-0 md:pr-8 mb-4 md:mb-0">
        <PaymentMethod
          handlePaymentChange={handlePaymentChange}
          selectedPaymentMethod={selectedPaymentMethod}
          walletBalance={currentData?.balance}
          billAmount={summary?.totalAmount}
        />

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white p-6 shadow rounded-lg"
        >
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
            <p>Please add an address...</p>
          )}
          <button
            onClick={() => navigate("addresses")}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {!defaultAddress ? "Add Address" : "Change Address"}
          </button>
        </motion.div>
      </div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="md:w-1/2 bg-white p-4 shadow rounded-lg flex-col flex"
      >
        <CartSummary {...summary} />
        {isLoading || isLoadingVerifyPayment ? (
          <LoadingButton className="mt-6 w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 flex items-center justify-center" />
        ) : (
          <motion.button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCheckCircle className="mr-2" />
            Place Order
          </motion.button>
        )}
        {/* Order Items */}
        <div className="bg-gray-100 p-4 mt-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Items</h2>
          <div className="grid grid-cols-2 gap-2">
            {cartDetails?.items.map((product) => (
              <motion.div
                key={product.productId._id}
                className="text-center cursor-pointer"
                onClick={() =>
                  navigate(`/product-details?id=${product.productId._id}`)
                }
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={product.productId.thumbnail}
                  alt={product.productId.productName}
                  className="w-14 h-14 object-cover mx-auto mb-2 rounded-lg shadow-sm"
                />
                <p className="text-sm font-semibold">
                  {product.productId.productName}
                </p>
                <p className="text-sm text-gray-600">{`Qty: ${product.quantity}`}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
  );
};




// step indicator

const StepIndicator = ({ step, label, isActive, isLast }) => (
  <div className="flex items-center mt-4 lg:mt-0">
    <div
      className={`${
        isActive ? "bg-black text-white" : "bg-gray-300 text-gray-700"
      } w-8 h-8 rounded-full flex items-center justify-center`}
    >
      {step}
    </div>
    <span
      className={`ml-2 font-semibold ${
        isActive ? "text-black" : "text-gray-700"
      }`}
    >
      {label}
    </span>
    {!isLast && (
      <div className="hidden lg:block flex-1 h-px bg-gray-300 mx-4"></div>
    )}
  </div>
);

const StepSeparator = ({isActive}) => (
  <div className={` ${isActive?' bg-black':"bg-gray-300"} hidden lg:block flex-1 h-px  mx-4 `}></div>
);
import PropTypes from 'prop-types';
import { isAction } from "@reduxjs/toolkit";
import { useGetWalletDetailsQuery } from "../../../slices/user/wallet/walletApiSlice";

// StepIndicator component prop types
StepIndicator.propTypes = {
  step: PropTypes.string,        // Step number to display
  label: PropTypes.string,       // Label text for the step
  isActive: PropTypes.bool,      // Determines if the step is active
  isLast: PropTypes.bool         // Determines if it's the last step
};

StepSeparator.protTypes = {
  isActive:PropTypes.bool
}
export default CheckoutPage;
