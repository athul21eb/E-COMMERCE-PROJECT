import PropTypes from 'prop-types';
import { SiRazorpay } from "react-icons/si";
import { FaWallet, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

const PaymentMethod = ({ selectedPaymentMethod, handlePaymentChange, billAmount, walletBalance }) => {
  
  console.log(billAmount,walletBalance);
  return (
    <motion.div
      className="bg-white p-6 mb-8 shadow-md rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6">Choose Your Payment Method</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        
        {/* Cash on Delivery */}
        <motion.div
          className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
            selectedPaymentMethod === "PayOnDelivery"
              ? "border-gray-800 bg-gray-100 shadow-md"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          }`}
          whileHover={{ scale: 1.05 }}
          onClick={() => handlePaymentChange({ target: { value: "PayOnDelivery" } })}
        >
          <div className="flex items-center">
            <FaMoneyBillWave className="text-gray-600 text-2xl mr-4" />
            <span className="text-lg font-medium">Cash on Delivery</span>
          </div>
          <input
            type="radio"
            id="PayOnDelivery"
            name="paymentMethod"
            value="PayOnDelivery"
            checked={selectedPaymentMethod === "PayOnDelivery"}
            onChange={handlePaymentChange}
            className="form-radio h-5 w-5"
          />
        </motion.div>

        {/* Razorpay */}
        <motion.div
          className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
            selectedPaymentMethod === "RazorPay"
              ? "border-indigo-800 bg-indigo-50 shadow-md"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          }`}
          whileHover={{ scale: 1.05 }}
          onClick={() => handlePaymentChange({ target: { value: "RazorPay" } })}
        >
          <div className="flex items-center">
            <SiRazorpay className="text-indigo-600 text-2xl mr-4" />
            <span className="text-lg font-medium">RazorPay</span>
          </div>
          <input
            type="radio"
            id="RazorPay"
            name="paymentMethod"
            value="RazorPay"
            checked={selectedPaymentMethod === "RazorPay"}
            onChange={handlePaymentChange}
            className="form-radio h-5 w-5"
          />
        </motion.div>

        {/* Wallet */}
        <motion.div
          className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
            selectedPaymentMethod === "Wallet"
              ? "border-black bg-gray-100 shadow-md"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          } ${walletBalance < billAmount ? "opacity-75 cursor-not-allowed" : ""}`}
          whileHover={{ scale: 1.05 }}
          onClick={() => walletBalance >= billAmount && handlePaymentChange({ target: { value: "Wallet" } })}
        >
          <div className="flex items-center">
            <FaWallet className="text-black text-2xl mr-4" />
            <span className="text-lg font-medium"> Wallet</span>
            {walletBalance && (
              <span className="ml-2 text-thin text-gray-500">
                (Balance: ₹{walletBalance})
                {(walletBalance < billAmount)&&(` Insufficient Balance`)}
              </span>
            )}
          </div>
          <input
            type="radio"
            id="Wallet"
            name="paymentMethod"
            value="Wallet"
            checked={selectedPaymentMethod === "Wallet"}
            onChange={handlePaymentChange}
            className="form-radio h-5 w-5"
            disabled={walletBalance&&(walletBalance < billAmount)}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

PaymentMethod.propTypes = {
  selectedPaymentMethod: PropTypes.string.isRequired,
  handlePaymentChange: PropTypes.func.isRequired,
  billAmount: PropTypes.number.isRequired,
  walletBalance: PropTypes.number,
};

export default PaymentMethod;
