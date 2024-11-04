// import React, { useEffect, useState } from "react";
// import { Box, Typography, Button, Grid, Paper, Divider } from "@mui/material";

// import { useLocation, useNavigate } from "react-router-dom";

// import { format } from "date-fns";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";

// const OrderList = () => {
//   const [getOrderDetailsById,{isLoading,isUninitialized,isFetching,currentData}] = useLazyGetOrderByIdQuery();
//   const [cancelItem] = useCancelOrderItemMutation();
  
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get("id");

//   const [order, setOrder] = useState(null);
//   const [cancellingItemId, setCancellingItemId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const fetchData = async () => {
//     try {
//       const response = await getOrderDetailsById(id).unwrap();
//       const { order } = response;
//       setOrder(order);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleCancelItem = async () => {
//     try {
//       await cancelItem({ itemId: cancellingItemId, orderId: id }).unwrap();
//       setCancellingItemId(null);
//       fetchData();
//       closeModal();
//     } catch (err) {
//       toast.error(err?.data?.message || err?.error);
//       console.error(err);

//     }
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     fetchData();
//   }, []);

//   const deliveryDate = new Date(order?.orderDate);
//   deliveryDate.setDate(deliveryDate.getDate() + 7);

  
//   ////-------------------------render component------------
//   if(isLoading||isUninitialized||isFetching){
//     return <LoadingScreen/>
//   }

//   if (!order || !order.items || order.items.length === 0) {
//     return <Typography variant="h1">No items in this order.</Typography>;
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "orange";
//       case "Confirmed":
//         return "purple";
//       case "Shipped":
//         return "blue";
//       case "Delivered":
//         return "green";
//       case "Cancelled":
//         return "red";
//       case "Return Requested":
//         return "teal";
//       case "Return Accepted":
//         return "lime";
//       case "Return Rejected":
//         return "brown";
//       case "Failed":
//         return "gray";
//       default:
//         return "black";
//     }
//   };
  

  
//   return (
//     <Box padding={2}>
//       <BackButton className="mb-4 bg-slate-600" />

//       {/* Shipping Address Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Paper
//           elevation={3}
//           style={{
//             padding: "16px",
//             marginBottom: "16px",
//             borderRadius: "8px",
//             backgroundColor: "black",
//             color: "white",
//           }}
//         >
//           <Grid container spacing={2} justifyContent="space-between" alignItems="center">
//             <Grid item xs={12} sm={3}>
//               <Typography variant="body2">Ship To</Typography>
//               <Typography variant="h6">
//                 {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
//               </Typography>
//               <Typography variant="body2">
//                 {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
//               </Typography>
//               <Typography variant="body2">Pincode: {order?.shippingAddress?.pincode}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <Typography variant="body2">Order Date</Typography>
//               <Typography variant="h6">
//                 {format(new Date(order.orderDate), "dd MMM, yyyy")}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <Typography variant="body2">Order ID</Typography>
//               <Typography variant="h6">#{order.orderId}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <Typography variant="body2">Total</Typography>
//               <Typography variant="h6">₹{order?.billAmount}</Typography>
//             </Grid>
//           </Grid>
//         </Paper>
//       </motion.div>

//       {/* Order Items */}
//       {order?.items.map((item, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//         >
//           <Paper
//             elevation={3}
//             style={{
//               padding: "16px",
//               marginBottom: "16px",
//               borderRadius: "8px",
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={3}>
//                 <img
//                   src={item.productId?.thumbnail}
//                   alt={item.productId?.productName}
//                   style={{
//                     width: "150px",
//                     height: "100px",
//                     objectFit: "cover",
//                     borderRadius: "8px",
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <Typography variant="h6">{item.productId?.productName}</Typography>
//                 <Typography variant="body2">
//                   Category: {item.productId?.category?.categoryName}
//                 </Typography>
//                 <Typography variant="subtitle1">Price: ₹{item.productId?.salePrice}</Typography>
//                 <Typography variant="body2">Size: {item.size}</Typography>
//                 <Typography variant="body2">Quantity: {item.quantity}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <Typography variant="h6">{item.productId?.productName}</Typography>
//                 <Typography variant="body2">
//                   Category: {item.productId?.category?.categoryName}
//                 </Typography>
//                 <Typography variant="subtitle1">Price: ₹{item.itemTotalPrice}</Typography>
//                 <Typography variant="body2">Size: {item.size}</Typography>
//                 <Typography variant="body2">Quantity: {item.quantity}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <Typography
//                   variant="h6"
//                   color={getStatusColor(item?.status)}
//                   style={{ marginBottom: "16px" }}
//                 >
//                   Product Status: {item?.status}
//                 </Typography>

//                 {item?.status === "Confirmed" && (
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => {
//                       setCancellingItemId(item._id);
//                       openModal();
//                     }}
//                   >
//                     Cancel Item
//                   </Button>
//                 )}
//                 {item?.status === "Delivered" && (
//                   <Button variant="contained" color="info">
//                     Return Item
//                   </Button>
//                 )}
//               </Grid>
//             </Grid>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
//               <Typography variant="body1">
//                 Delivery on: {format(new Date(deliveryDate), "dd MMM, yyyy")}
//               </Typography>
//               <Button variant="text" color="primary">
//                 Invoice
//               </Button>
//             </Box>
//           </Paper>
//         </motion.div>
//       ))}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         title="Cancel Item"
//         footer={
//           <>
//             <Button variant="outlined" onClick={closeModal}>
//               Cancel
//             </Button>
//             <Button variant="contained" color="error" onClick={handleCancelItem}>
//               Confirm
//             </Button>
//           </>
//         }
//       >
//         <p>Are you sure you want to cancel this item?</p>
//       </Modal>
//     </Box>
//   );
// };

// export default OrderList;





import React, { useState, useEffect } from 'react'
import { FaShoppingCart, FaTruck, FaCalendarAlt, FaCreditCard, FaArrowLeft } from 'react-icons/fa'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import LoadingScreen from "../../../../../components/common/LoadingScreens/LoadingScreen";
 import Modal from "../../../../../components/common/Modals/Modal";
import BackButton from "../../../../../components/common/ReusableButton/BackButton";
import {
  useCancelOrderItemMutation,
  useLazyGetOrderByIdQuery,
} from "../../../../../slices/user/orders/orderApiSlice";
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatDate } from '../../../../../utils/helper/formatDate'



// const mockOrderData = {
//   "_id": { "$oid": "671b40dff8698de99e74913f" },
//   "userId": { "$oid": "66cd6d0fdd5dcfacda5faaae" },
//   "items": [
//     {
//       "productId": { 
//         "$oid": "66cec12af073329219b68d23",
//         "productName": "Sample Product",
//         "thumbnail": "/placeholder.svg?height=100&width=100",
//         "category": { "categoryName": "Sample Category" },
//         "salePrice": 8999
//       },
//       "quantity": 1,
//       "size": "5",
//       "unitPrice": 8999,
//       "itemTotalPrice": 8999,
//       "appliedOfferAmount": 0,
//       "status": "Confirmed",
//       "_id": { "$oid": "671b40dff8698de99e749140" }
//     }
//   ],
//   "billAmount": 8999,
//   "shippingAddress": {
//     "firstName": "athul",
//     "lastName": "Bindhu",
//     "state": "Kerala",
//     "district": "thrissur",
//     "city": "thrissur",
//     "pincode": "680001",
//     "landmark": "vhgjvv",
//     "mobileNumber": "0808691135",
//     "alternateNumber": "2569874563",
//     "isDefaultAddress": true,
//     "_id": { "$oid": "67057c021602733e464421f5" },
//     "createdAt": { "$date": "2024-10-08T18:37:54.985Z" },
//     "updatedAt": { "$date": "2024-10-08T18:37:54.985Z" }
//   },
//   "payment": {
//     "method": "RazorPay",
//     "status": "Success",
//     // "transactionId": "b2124292-18bd-4ba6-8810-70b092e315b3",
//     // "gateway_order_id": "order_PDBAe9YfJT2hWZ"
//   },
//   "orderStatus": "Confirmed",
//   "appliedCouponAmount": 0,
//   "orderId": "1a156972-56c2-4ef9-90e0-5b244f1abdde",
//   "orderDate":  "2024-10-25T06:55:27.395Z" ,
//   "createdAt": { "$date": "2024-10-25T06:55:27.455Z" },
//   "updatedAt": { "$date": "2024-10-25T06:56:17.154Z" },
//   "__v": 0
// }

export default function OrderDetails() {


    const [getOrderDetailsById,{isLoading,isUninitialized,isFetching,currentData}] = useLazyGetOrderByIdQuery();
  const [cancelItem ,{isLoading:isLoadingCancelItem}] = useCancelOrderItemMutation();
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [order, setOrder] = useState(currentData??null);
  const [cancellingItemId, setCancellingItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {
    try {
      const response = await getOrderDetailsById(id).unwrap();
      const { order } = response;
      setOrder(order);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelItem = async () => {
    try {
      const res = await cancelItem({ itemId: cancellingItemId, orderId: id }).unwrap();
     toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);

    }finally{
      setCancellingItemId(null);
      fetchData();
      closeModal();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();

    
  }, []);

  console.log(order);
  const deliveryDate = new Date(order?.orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 7);

 

  

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-orange-500"
      case "Confirmed": return "text-purple-500"
      case "Shipped": return "text-blue-500"
      case "Delivered": return "text-green-500"
      case "Cancelled": return "text-red-500"
      case "Return Requested": return "text-teal-500"
      case "Return Accepted": return "text-lime-500"
      case "Return Rejected": return "text-brown-500"
      case "Failed": return "text-gray-500"
      default: return "text-black"
    }
  }
  ////--------------------------------render component----------------------------

   if(isLoading||isUninitialized||isFetching){
    return <LoadingScreen/>
  }

  if (!order || !order.items || order.items.length === 0) {
    return <Typography variant="h1">No items in this order.</Typography>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
     <BackButton/>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white p-6 rounded-lg shadow-lg mb-8"
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
            <p className="font-semibold">{formatDate(order.orderDate)}</p>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaCreditCard className="mr-2" />
          Payment Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Method</p>
            <p className="font-semibold">{order.payment.method}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`font-semibold ${order.payment.status === 'Success' ? 'text-green-500' : (order.payment.status === 'Pending'?'text-yellow-500':"text-red-500")}`}>
              {order.payment.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="font-semibold">{order.payment.transactionId??"Nil"}</p>
          </div>
          {/* <div>
            <p className="text-sm text-gray-600">Gateway Order ID</p>
            <p className="font-semibold">{order.payment.gateway_order_id??"Nil"}</p>
          </div> */}
        </div>
      </motion.div>

      {order.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
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
              <p className="text-gray-600">Category: {item.productId.category.categoryName}</p>
              <p className="text-gray-600">Price: ₹{item.itemTotalPrice}</p>
              <p className="text-gray-600">Size: {item.size}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="md:w-1/4 flex flex-col justify-between">
              <div>
                <p className={`text-lg font-semibold mb-4 ${getStatusColor(item.status)}`}>
                  Status: {item.status}
                </p>

               
                {item.status === "Confirmed" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setCancellingItemId(item._id)
                      setIsModalOpen(true)
                    }}
                  >
                    Cancel Item
                  </Button>
                )}
                {item.status === "Delivered" && (
                  <Button variant="contained" color="primary">
                    Return Item
                  </Button>
                )}
              </div>
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
        </motion.div>
      ))}

      <div className="text-center">
        <Button variant="outlined" color="inherit">
          Download Invoice
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={!isLoadingCancelItem&&closeModal}
        title="Cancel Item"
        footer={
          <>
            <Button disabled={isLoadingCancelItem} variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={isLoadingCancelItem} variant="contained" color="error" onClick={handleCancelItem}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to cancel this item?</p>
      </Modal>
    </div>
  )
}