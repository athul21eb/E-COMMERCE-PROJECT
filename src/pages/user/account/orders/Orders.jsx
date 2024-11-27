import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaChevronRight, FaShoppingBasket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLazyGetOrdersForUserQuery } from "../../../../slices/user/orders/orderApiSlice";
import RenderPagination from "../../../../components/common/Pagination/RenderPagination";
import LoadingScreen from "../../../../components/common/LoadingScreens/LoadingScreen";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import EmptyAnimation from "../../../../components/common/animations/EmptyCartAnimations";
import { ShoppingBag, ShoppingBagIcon } from "lucide-react";


const CoolOrderRows = () => {
  const navigate = useNavigate();
  const [fetchOrders, { isLoading, isUninitialized, isFetching, currentData }] =
    useLazyGetOrdersForUserQuery();
  const [orders, setOrders] = useState(currentData?.orders ?? []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(1);
  const itemsPerPage = 10;

  const fetchOrdersData = async () => {
    try {
      const { orders, totalOrders } = await fetchOrders({
        currentPage,
        itemsPerPage,
      }).unwrap();
      if (totalOrders) {
        setTotalOrdersCount(totalOrders);
        if (orders) {
          setOrders(orders);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "Initiated": return "bg-blue-100 text-blue-800";
  //     case "Pending": return "bg-yellow-100 text-yellow-800";
  //     case "Confirmed": return "bg-green-100 text-green-800";
  //     case "Failed": return "bg-red-100 text-red-800";
  //     default: return "bg-gray-100 text-gray-800";
  //   }
  // };

  if (isLoading || isUninitialized || isFetching) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8  min-h-screen">
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-6 sm:mb-10 text-gray-800">
        My Orders
      </h1>

      <AnimatePresence>
        <motion.div
          className="space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {orders.length === 0 ? (
            <motion.div
              className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <EmptyAnimation icon={<ShoppingBagIcon className="w-28 h-28 sm:w-32 sm:h-32 text-customColorTertiarypop fill-customColorTertiaryDark" />}/>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">
                No Orders Yet
              </h2>
              <p className="text-gray-500 mt-2">
                Start shopping to see your orders here!
              </p>
            </motion.div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.orderId}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                variants={rowVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`order-details?id=${order.orderId}`)}
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="flex -space-x-4 overflow-hidden">
                      {order.items.slice(0, 2).map((item, index) => (
                        <img
                          key={index}
                          className="inline-block h-12 w-12 sm:h-16 sm:w-16 rounded-full ring-2 ring-white"
                          src={item.productId.thumbnail}
                          alt={item.productId.productName}
                        />
                      ))}
                      {order.items.length > 2 && (
                        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-300 ring-2 ring-white">
                          <span className="text-xs sm:text-sm font-medium text-gray-800">
                            +{order.items.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base text-gray-800">
                        Order ID: {order.orderId}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Ordered Date:{" "}
                        {format(new Date(order.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                 <div className="flex justify-between items-center w-full sm:w-auto">
  {/* Left section with Retry Button and Order Amount */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
    {/* Retry Payment Button for Failed Orders */}
    {order.orderStatus === "Failed" && (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/checkout",{state:{from:"/account/orders",RetryPaymentOrder:order}});
        }}
        color="error"
        className="text-xs sm:text-sm px-3 py-1 rounded-lg"
      >
        Retry Payment
      </Button>
    )}

    {/* Order Amount */}
    <p className="text-lg sm:text-2xl font-bold text-gray-800">
      ₹{order.billAmount}
    </p>
  </div>

  {/* Right Chevron Icon */}
  <FaChevronRight className="text-gray-400 w-4 h-4 sm:w-6 sm:h-6 ml-4" />
</div>

                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 sm:mt-12">
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalOrdersCount}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default CoolOrderRows;
