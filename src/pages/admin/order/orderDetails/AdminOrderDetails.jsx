import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyGetOrderByIdFromAllOrdersQuery, useUpdateOrderItemStatusMutation } from "../../../../slices/admin/order/orderApiSlice";
import AdminBreadCrumbs from "../../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import CustomModal from "../../../../components/common/Modals/Modal";
import { format } from "date-fns";
import BackButton from "../../../../components/common/ReusableButton/BackButton";
import { motion } from "framer-motion";
import { useTheme } from "../../../../contexts/themeContext";
import LoadingScreen from "../../../../components/common/LoadingScreens/LoadingScreen";
import { toast } from "react-toastify";
import { formatDate } from "../../../../utils/helper/formatDate";

// Status priority
const statusPriority = { "Pending": 1, "Confirmed": 2, "Shipped": 3, "Delivered": 4, "Cancelled": 5 };

const AdminOrderDetails = () => {
  const [getOrderDetailsById, { isLoading, isUninitialized, isFetching }] = useLazyGetOrderByIdFromAllOrdersQuery();
  const [updateOrderItemStatus] = useUpdateOrderItemStatusMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const { themeStyles, theme } = useTheme(); 

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedItem(null);
    setNewStatus("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, [id]); // Added id to dependency array

  const fetchData = async () => {
    try {
      const response = await getOrderDetailsById(id).unwrap();
      setOrder(response.order);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || isUninitialized || isFetching) {
    return <LoadingScreen />;
  }

  if (!order || !order.items || order.items.length === 0) {
    return <Typography variant="h1">No items in this order.</Typography>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-500";
      case "Confirmed":
        return "text-yellow-500"; // Fixed color here
      case "Shipped":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-black";
    }
  };

  const canChangeStatus = (currentStatus) => {
    return statusPriority[currentStatus] < statusPriority["Cancelled"];
  };

  const handleChangeStatus = (item, status) => {
    setSelectedItem(item);
    setNewStatus(status);
    openModal();
  };

  const handleConfirmStatusChange = async () => {
    try {
      const res = await updateOrderItemStatus({ orderId: order.orderId, itemId: selectedItem._id, status: newStatus }).unwrap();
      // Refresh the order details after updating
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    } finally {
      fetchData(); 
      closeModal();
    }
  };

  const containerStyle = {
    backgroundColor: theme === "dark" ? themeStyles.backgroundDark : themeStyles.background,
    color: theme === "dark" ? themeStyles.textColorDark : themeStyles.textColor,
  };

  return (
    <div className="container mx-auto px-4 py-8" style={containerStyle}>
      <div className="flex flex-col space-y-5 items-start mb-5">
        <AdminBreadCrumbs />
        <BackButton />
      </div>

      {/* Order Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-lg shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-black text-white"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-75">Ship To</p>
            <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p>Pincode: {order.shippingAddress.pincode}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Order Date</p>
            <p className="font-semibold">{format(new Date(order.orderDate), 'dd MMM, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Order ID</p>
            <p className="font-semibold">{order.orderId}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Total</p>
            <p className="font-semibold">₹{order.billAmount}</p>
          </div>
        </div>
      </motion.div>

      {/* Payment Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-lg shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      >
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"}`}>Method</p>
            <p className="font-semibold">{order.payment.method || "N/A"}</p>
          </div>
          <div>
            <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"}`}>Status</p>
            <p className={`font-semibold ${order.payment.status === 'Success' ? 'text-green-500' : (order.payment.status === 'Pending' ? 'text-yellow-500' : "text-red-500")}`}>
              {order.payment.status || "N/A"}
            </p>
          </div>
          <div>
            <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"} text-sm`}>Transaction ID</p>
            <p className="font-semibold">{order.payment.transactionId ?? "Nil"}</p>
          </div>
        </div>
      </motion.div>

      {/* Order Items */}
      {order.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-6 rounded-lg shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <img
                src={item.productId.thumbnail}
                alt={item.productId.productName}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold mb-2">{item.productId.productName}</h3>
              <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"}`}>Category: {item.productId.category.categoryName}</p>
              <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"}`}>Price: ₹{item.productId.salePrice}</p>
              <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"}`}>Size: {item.size}</p>
              <p className={`${theme==="dark"?"text-slate-300":"text-gray-600"}`}>Quantity: {item.quantity}</p>
            </div>
            <div className="md:w-1/4 flex flex-col justify-between">
            <div>
  <p className={`text-lg font-semibold mb-4 ${getStatusColor(item.status)}`}>
    Status: {item.status}
  </p>
  {canChangeStatus(item.status) && (
    <>
      {item.status === "Confirmed" && (
        <>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleChangeStatus(item, "Shipped")}
          sx={{ mx: 2 }}  // Adds bottom margin for spacing
          >
            Mark as Shipped
          </Button>
          <Button
      variant="contained"
      color="error"
      onClick={() => handleChangeStatus(item, "Cancelled")}
    sx={{ mx: 2 }}  // Adds bottom margin for spacing
    >
      Cancel Item
    </Button>
        </>
      )}
      {item.status === "Shipped" && (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleChangeStatus(item, "Delivered")}
          sx={{ mx: 2 }}  // Adds bottom margin for spacing
          >
            Mark as Delivered
          </Button>
        </>
      )}
    </>
  )}
   <div className="mt-4">
  {item.status === "Delivered" ? (
    <div>
      <p className="text-sm text-gray-600">Delivered At:</p>
      <p className="font-semibold">{formatDate(new Date(item.deliveryDate))}</p>
    </div>
  ) : item.status === "Cancelled" ? (
    <div>
      <p className="text-sm text-gray-600">Canceled on:</p>
      <p className="font-semibold">{formatDate(new Date(item.cancelledDate))}</p>
    </div>
  ) : (
    <div>
      <p className="text-sm text-gray-600">Delivery on:</p>
      <p className="font-semibold">
        {formatDate(new Date(order.orderDate).setDate(new Date(order.orderDate).getDate() + 7))}
      </p>
    </div>
  )}
</div>
  
</div>

            </div>
          </div>
        </motion.div>
      ))}
    {/* Modal for status confirmation */}
    <CustomModal
  isOpen={isModalOpen}
  onClose={closeModal}
  title={`Change Status of ${selectedItem?.productId?.productName}`}
  footer={
    <div className="flex justify-end space-x-3">
      <Button variant="outlined" color="secondary" onClick={closeModal}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirmStatusChange}
      >
        Confirm
      </Button>
    </div>
  }
>
  <Typography variant="body1">
    Are you sure you want to change the status of this item to{" "}
    <strong>{newStatus}</strong>?
  </Typography>
  
</CustomModal>

    </div>
  );
};

export default AdminOrderDetails;
