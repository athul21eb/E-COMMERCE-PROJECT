import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaWallet, FaExchangeAlt, FaShieldAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import {
  useAddMoneyToWalletMutation,
  useCreateWalletMutation,
  useGetWalletDetailsQuery,
  useVerifyPaymentForWalletMutation,
} from "../../../../slices/user/wallet/walletApiSlice";
import {format} from 'date-fns'
import { Button, TextField, useStepContext } from "@mui/material";
import Modal from "../../../../components/common/Modals/Modal";
import { toast } from "react-toastify";
import ReusableTable from "../../../../components/common/reUsableTable/ReUsableTable";
import LoadingScreen from "../../../../components/common/LoadingScreens/LoadingScreen";
import RenderPagination from "../../../../components/common/Pagination/RenderPagination";

const WalletComponent = () => {
   //pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [totalTransactionsCount, setTotalTransactionsCount] = useState(1);
   const itemsPerPage = 3;

  const { currentData, isLoading, isError, refetch } = useGetWalletDetailsQuery({page:currentPage,limit:itemsPerPage});
  const [CreateWalletApiCall, { isLoading: isLoadingCreateWallet }] =
    useCreateWalletMutation();

  const [addMoneyApiCall, { isLoading: isLoadingAddMoney }] =
    useAddMoneyToWalletMutation();
  const [verifyPayment] = useVerifyPaymentForWalletMutation();
  const [wallet, setWallet] = useState(currentData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMoneyMode, setAddMoneyMode] = useState(false);
  const [amount, setAmount] = useState(1);
 

  const handleCreateWallet = async () => {
    try {
      if (wallet) {
        return;
      }

      const res = await CreateWalletApiCall().unwrap();
      toast.success(res?.message);
      if (res?.wallet) {
        setWallet(wallet);
      }
    } catch (error) {
      toast.error(error?.data?.message);
      console.log(error);
    } finally {
      setIsModalOpen(false);
      refetch();
    }
  };

  useEffect(() => {
   
    refetch();

    if (currentData?.isWalletCreated) {
      setWallet(currentData);
      console.log(currentData);
      setTotalTransactionsCount(currentData?.totalTransactions)
    }
  }, [currentData]);

  const headers = ["transaction_id", "amount", "type","description", "date"];
  const rows = wallet?.transactions?.length
  ? wallet.transactions.map((txn) => {
      const formattedAmount = txn.type === "credit" 
        ? <span style={{ color: "green" }}>+{txn.amount}</span> 
        : <span style={{ color: "red" }}>-{txn.amount}</span>;

      const formattedDate = format(new Date(txn.updatedAt), "dd MMM yyyy");

      return [
        txn.transaction_id,
        formattedAmount,
        txn.type,
        txn.description,
        <span>{formattedDate}</span>,
      ];
    })
  : [];

  /////------------------------------razor pay functions

  const handleAddMoney = async () => {
    try {
      if (amount < 1 || amount > 49999) {
        toast.warning("Invalid Amount");
        return;
      }

      const res = await addMoneyApiCall({ amount }).unwrap();
      loadRazorPayCheckout(res);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setAddMoneyMode(false);
      setAmount(1);
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function loadRazorPayCheckout(orderData) {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        toast.error("Failed to load payment page please try again later");
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: " FIRE BOOTS ",
        description: "Proceed with your suitable payment",
        image:
          "https://res.cloudinary.com/dmrvutjac/image/upload/v1725459108/userProfiles/liv97lcag234dudyxpro.png",
        order_id: orderData.id,
        handler: function (res) {
          handlePaymentResponse(res);
        },
        notes: {
          address: "The FIRE BOOTS Store  Office",
        },
        theme: {
          color: "#FFFFFF",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (res) => {
        handlePaymentResponse(res);
      });
      razorpay.open();
    } catch (error) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  }

  async function handlePaymentResponse(paymentDetails) {
    try {
      const res = await verifyPayment(paymentDetails).unwrap();
      toast.success(res?.message);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    } finally {
      refetch();
    }
  }



  ////----------------------------------------render component-------------------

  if(isLoading){
    return <LoadingScreen/>
  }

  return (
    <div className="w-[400px] md:w-full mx-auto ">
      {wallet ? (
        <motion.div
          className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 shadow-lg rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Wallet Header */}
          <motion.div
            className="bg-blue-700 text-white rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="font-bold flex items-center text-xl sm:text-2xl">  
              <FaWallet className="mr-2" />
              My Wallet
            </div>
            <motion.div
              className="text-lg sm:text-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Wallet Balance:{" "}
              <span className="text-yellow-300">₹{wallet?.balance}</span>
            </motion.div>

            {/* Add Money Button */}
            <motion.button
              className="bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-6 rounded-full font-semibold shadow-lg flex items-center justify-center w-full sm:w-auto transition-all duration-300 hover:shadow-xl"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 12px rgba(0, 128, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAddMoneyMode(true);
                setIsModalOpen(true);
              }}
            >
              <AiOutlinePlus className="mr-2 text-lg" />
              Add Money
            </motion.button>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            className="bg-white rounded-lg p-4 sm:p-6 mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold capitalize text-center mb-6">
              Transaction History
            </h3>
            <ReusableTable headers={headers} rows={rows} />
            <RenderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProductsCount={totalTransactionsCount}
        itemsPerPage={itemsPerPage}
        className="mx-auto"
      />
          </motion.div>
        </motion.div>
      ) : (
        <CreateWallet setIsModalOpen={setIsModalOpen} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (addMoneyMode) {
            setIsModalOpen(false);
            setAddMoneyMode(false);
            setAmount(1);
          } else {
            setIsModalOpen(false);
          }
        }}
        title={
          addMoneyMode
            ? "Add Money to Wallet"
            : "Are you sure to create wallet?"
        }
        footer={
          addMoneyMode ? (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsModalOpen(false);
                  setAddMoneyMode(false);
                  setAmount(1);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={amount < 1 || amount > 49999 || isLoadingAddMoney}
                variant="contained"
                color="success"
                onClick={handleAddMoney}
              >
                Add Money
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoadingCreateWallet}
                variant="contained"
                color="success"
                onClick={handleCreateWallet}
              >
                Confirm
              </Button>
            </>
          )
        }
      >
        {addMoneyMode ? (
          <div className="p-4">
            <TextField
              label="Enter Amount"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
            {amount < 1 && (
              <span className="text-red-700 font-thin text-sm">
                Minimum amount is One Rupees
              </span>
            )}
            {amount > 49999 && (
              <span className="text-red-700 font-thin text-sm">
                Maximum amount is 49999 Rupees
              </span>
            )}
          </div>
        ) : (
          <p>Are you sure you want to create a wallet?</p>
        )}
      </Modal>
    </div>
  );
};
const CreateWallet = ({ setIsModalOpen }) => {
  const iconAnimationVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-start text-center min-h-screen  bg-white rounded-lg p-4 md:pt-20 lg:p-12">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create Your Digital Wallet
      </motion.h1>

      <motion.p
        className="text-center text-gray-600 max-w-md mb-8 md:max-w-lg lg:max-w-xl mx-4 md:mx-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Start managing your digital assets securely. Our wallet provides easy
        transactions and top-notch security features for your peace of mind.
      </motion.p>

      <div className="flex flex-wrap justify-center space-x-8 mb-12 gap-y-8 md:gap-y-0">
        <div className="flex flex-col items-center">
          <motion.div variants={iconAnimationVariants} animate="animate">
            <FaExchangeAlt className="text-5xl text-green-500" />
          </motion.div>
          <p className="text-sm text-gray-500 mt-4">Easy Exchange</p>
        </div>
        <div className="flex flex-col items-center">
          <motion.div variants={iconAnimationVariants} animate="animate">
            <FaShieldAlt className="text-5xl text-blue-500" />
          </motion.div>
          <p className="text-sm text-gray-500 mt-4">Secure Storage</p>
        </div>
      </div>

      <motion.button
        className="px-6 py-3 text-white bg-purple-600 rounded-full shadow-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <FaWallet className="text-xl" />
        <span className="text-lg font-semibold">Create Wallet</span>
      </motion.button>
    </div>
  );
};

// PropTypes
CreateWallet.propTypes = {
  setIsModalOpen: PropTypes.func,
};

export default WalletComponent;
