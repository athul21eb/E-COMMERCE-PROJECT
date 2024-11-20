

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import EmptyAnimation from '../../../components/common/animations/EmptyCartAnimations';

export default function OrderCompletion() {
  const router = useNavigate();

  const handleContinueShopping = () => {
    router('/shop');
  };

  const handleGoToOrders = () => {
    router('/account/orders');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
       
        <EmptyAnimation icon={<CheckCircle className="w-28 h-28 sm:w-32 sm:h-32 " />} />
      </motion.div>

      {/* Heading */}
      <motion.h1
        className="text-2xl sm:text-3xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your order is Confirmed
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-sm sm:text-base text-muted-foreground text-center mb-8 max-w-md px-2 sm:px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Thank you for your order. We are processing it and will update you order History .
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          variant="outlined"
          onClick={handleContinueShopping}
          className="flex items-center justify-center w-full sm:w-auto"
        >

          <ShoppingBag className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
          Continue Shopping
        </Button>
        <Button
         variant="outlined"
         color='secondary'
          onClick={handleGoToOrders}
          className="flex items-center justify-center w-full sm:w-auto"
        >
          <Package className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
          Go to Orders
        </Button>
      </motion.div>
    </div>
  );
}
