import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaWallet, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';

const WalletComponent = () => {
  const [wallet, setWallet] = useState(false);
  
  const transactions = [
    { id: 'TXN12345', amount: '₹500', date: '2023-09-01' },
    { id: 'TXN12346', amount: '₹200', date: '2023-09-10' },
    { id: 'TXN12347', amount: '₹100', date: '2023-09-15' },
  ];

  return wallet ? (
    <motion.div
      className="w-full md:max-w-4/5 lg:max-w-3/5 mx-auto p-4 md:p-6 bg-gray-50 shadow-lg rounded-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Wallet Header */}
      <motion.div
        className="bg-blue-700 text-white rounded-lg p-4 md:flex justify-between items-center shadow-md mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="font-bold flex items-center text-lg md:text-xl">
          <FaWallet className="mr-2" />
          My Wallet
        </div>
        <motion.div
          className="text-md md:text-lg font-semibold mt-2 md:mt-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Wallet Balance: <span className="text-yellow-300">₹1216</span>
        </motion.div>
        
        {/* Add Money Button */}
        <motion.button
          className="bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-4 md:px-6 rounded-full mt-4 md:mt-0 font-semibold shadow-lg flex items-center justify-center w-full md:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl"
          whileHover={{ scale: 1.05, boxShadow: '0px 4px 12px rgba(0, 128, 0, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert('Add Money clicked')}
        >
          <AiOutlinePlus className="mr-2 text-lg" />
          <span className="hidden md:inline">Add Money</span>
        </motion.button>
      </motion.div>

      {/* Transaction History */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-4">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
          }}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="pb-3">ID</th>
                <th className="pb-3">Credit Amount</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="border-b text-gray-800"
                >
                  <td className="py-3">{txn.id}</td>
                  <td className="py-3">{txn.amount}</td>
                  <td className="py-3">{txn.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  ) : (
    <CreateWallet onCreate={() => setWallet(true)} />
  );
};

const CreateWallet = ({ onCreate }) => {
  const iconAnimationVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white rounded-lg p-2">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create Your Digital Wallet
      </motion.h1>
      
      <motion.p
        className="text-center text-gray-600 max-w-md mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Start managing your digital assets securely. Our wallet provides easy transactions 
        and top-notch security features for your peace of mind.
      </motion.p>

      <div className="flex justify-center space-x-16 mb-12">
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
        onClick={onCreate}
      >
        <FaWallet className="text-xl" />
        <span className="text-lg font-semibold">Create Wallet</span>
      </motion.button>
    </div>
  );
};

// PropTypes
CreateWallet.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default WalletComponent;
