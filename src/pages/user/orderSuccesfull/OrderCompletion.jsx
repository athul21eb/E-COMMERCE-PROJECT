import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OrderCompletion = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // Redirect to the home page or shop page
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Your order is completed</h1>
      <p className="text-gray-600 text-center mb-6">
        Thank you for your order, sit tight we are processing your order.
        <br />
        We will update you with your order in email.
      </p>
      <button
        onClick={handleContinueShopping}
        className="bg-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-400"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderCompletion;
