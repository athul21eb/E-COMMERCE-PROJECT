import { SiRazorpay } from "react-icons/si";
import { FaWallet, FaMoneyBillWave } from "react-icons/fa";

const PaymentMethod = ({ selectedPaymentMethod, handlePaymentChange }) => {
  return (
    <div className="bg-white p-6 mb-8 shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Choose Your Payment Method</h2>
      <div className="grid md:gap-6 sm:grid-cols-1 ">
        
        {/* Cash on Delivery */}
        <div
          className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
            selectedPaymentMethod === "PayOnDelivery"
              ? "border-gray-800 bg-gray-100 shadow-md"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          }`}
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
        </div>

        {/* Razorpay */}
        <div
          className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
            selectedPaymentMethod === "RazorPay"
              ? "border-indigo-800 bg-indigo-50 shadow-md"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          }`}
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
        </div>

        {/*  Wallet */}
        <div
          className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
            selectedPaymentMethod === "Wallet"
              ? "border-black bg-gray-100 shadow-md"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          }`}
          onClick={() => handlePaymentChange({ target: { value: "Wallet" } })}
        >
          <div className="flex items-center">
            <FaWallet className="text-black text-2xl mr-4" />
            <span className="text-lg font-medium"> Wallet</span>
          </div>
          <input
            type="radio"
            id="Wallet"
            name="paymentMethod"
            value="Wallet"
            checked={selectedPaymentMethod === "Wallet"}
            onChange={handlePaymentChange}
            className="form-radio h-5 w-5"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
