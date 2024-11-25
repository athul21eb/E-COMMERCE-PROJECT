import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaTruck,
  FaCalendarAlt,
  FaCreditCard,
  FaArrowLeft,
} from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  TextField,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { format } from "date-fns";
import LoadingScreen from "../../../../../components/common/LoadingScreens/LoadingScreen";
import Modal from "../../../../../components/common/Modals/Modal";
import BackButton from "../../../../../components/common/ReusableButton/BackButton";
import {
  useCancelOrderItemMutation,
  useLazyGetOrderByIdQuery,
  useReturnOrderItemMutation,
} from "../../../../../slices/user/orders/orderApiSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../utils/helper/formatDate";
import { downloadOrderDetailsPdf } from "../../../../../utils/helper/pdfDownload";

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
  const [
    getOrderDetailsById,
    { isLoading, isUninitialized, isFetching, currentData },
  ] = useLazyGetOrderByIdQuery();
  const [cancelItem, { isLoading: isLoadingCancelItem }] =
    useCancelOrderItemMutation();
  const [returnItem, { isLoading: isLoadingReturnItem }] =
    useReturnOrderItemMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [order, setOrder] = useState(currentData ?? null);
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
      const res = await cancelItem({
        itemId: cancellingItemId,
        orderId: id,
      }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    } finally {
      setCancellingItemId(null);
      fetchData();
      closeModal();
    }
  };

  ////---------------------item return function-----------------

  const [returningItemId, setReturningItemId] = useState(null);
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const closeReturnModal = () => {
    setIsReturnModalOpen(false);
    setErrors({});
  };
  const reasons = [
    "Product arrived damaged or defective",
    "Incorrect item received",
    "Product does not match description",
    "Changed mind after purchase",
    "Product does not fit as expected",
    "Other Reason",
  ];

  const handleReturnItem = async () => {
    const validationErrors = {};

    if (!reason) {
      validationErrors.reason =
        "Please select a reason for returning the item.";
    }

    if (reason === "Other Reason" && !remarks.trim()) {
      validationErrors.remarks =
        "Additional remarks are required for 'Other Reason'.";
    }
    if (remarks.trim().length > 100) {
      validationErrors.remarks =
        "Additional remarks cannot exceed 100 characters.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setErrors({});

      const response = await returnItem({
        orderId: id,
        itemId: returningItemId,
        reason,
        remarks,
      }).unwrap();
      fetchData();
      toast.success(response?.message);
    } catch (err) {
      toast.success(err?.data?.message || err.error);
      console.error(err);
    } finally {
      setReturningItemId(null);

      setIsReturnModalOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-500";
      case "Confirmed":
        return "text-yellow-500";
      case "Shipped":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      case "Failed":
        return "text-red-500";
      case "Return Requested":
        return "text-purple-500";
      case "Return Accepted":
        return "text-teal-500";
      case "Return Rejected":
        return "text-gray-500";
      default:
        return "text-black"; // Empty string for any unhandled statuses
    }
  };

  ////--------------------------------render component----------------------------

  if (isLoading || isUninitialized || isFetching) {
    return <LoadingScreen />;
  }

  if (!order || !order.items || order.items.length === 0) {
    return <Typography variant="h1">No items in this order.</Typography>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white p-6 rounded-lg shadow-lg mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-75">Ship To</p>
            <p className="font-semibold">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
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
            { order?.appliedCouponAmount!==0&&<div>
            <p className="text-sm opacity-75">Coupon Discount</p>
            <p className="font-semibold">₹{order.appliedCouponAmount}</p>
          </div>}
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
            <p
              className={`font-semibold ${
                order.payment.status === "Success"
                  ? "text-green-500"
                  : order.payment.status === "Pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {order.payment.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="font-semibold">
              {order.payment.transactionId ?? "Nil"}
            </p>
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
              <h3 className="text-xl font-semibold mb-2">
                {item.productId.productName}
              </h3>
              <p className="text-gray-600">
                Category: {item.productId.category.categoryName}
              </p>
              <p className="text-gray-600">Price: ₹{item.itemTotalPrice}</p>
              <p className="text-gray-600">Size: {item.size}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="md:w-1/4 flex flex-col justify-center">
              <div>
                <p
                  className={`text-lg font-semibold mb-4 ${getStatusColor(
                    item.status
                  )}`}
                >
                  Status: {item.status}
                </p>

                {item.status === "Confirmed" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setCancellingItemId(item._id);
                      setIsModalOpen(true);
                    }}
                  >
                    Cancel Item
                  </Button>
                )}
                {item.status === "Delivered" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setReturningItemId(item._id);
                      setIsReturnModalOpen(true);
                    }}
                  >
                    Return Item
                  </Button>
                )}
              </div>
              <div className="mt-4">
                {item.status === "Delivered" && (
                  <div>
                    <p className="text-sm text-gray-600">Delivered At:</p>
                    <p className="font-semibold">
                      {formatDate(new Date(item.deliveryDate))}
                    </p>
                  </div>
                )}

                {item.status === "Cancelled" && (
                  <div>
                    <p className="text-sm text-gray-600">Cancelled on:</p>
                    <p className="font-semibold">
                      {formatDate(new Date(item.cancelledDate))}
                    </p>
                  </div>
                )}

                {![
                  "Cancelled",
                  "Delivered",
                  "Return Requested",
                  "Return Accepted",
                  "Return Rejected",
                  "Failed",
                ].includes(item.status) && (
                  <div>
                    <p className="text-sm text-gray-600">Delivery on:</p>
                    <p className="font-semibold">
                      {formatDate(
                        new Date(order.orderDate).setDate(
                          new Date(order.orderDate).getDate() + 7
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {order?.orderStatus=="Confirmed"&&<div
        className="text-center"
        onClick={() => downloadOrderDetailsPdf(order)}
      >
        <Button variant="outlined" color="inherit">
          Download Invoice
        </Button>
      </div>}

      {/* //// Canceling item Modal  */}
      <Modal
        isOpen={isModalOpen}
        onClose={!isLoadingCancelItem && closeModal}
        title="Cancel Item"
        footer={
          <>
            <Button
              disabled={isLoadingCancelItem}
              variant="outlined"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoadingCancelItem}
              variant="contained"
              color={"error"}
              onClick={handleCancelItem}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to <strong>cancel</strong> this item?
        </p>
      </Modal>
      {/* //// Returning item Modal  */}

      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => (isLoadingReturnItem ? () => {} : closeReturnModal())}
        title="Return Item"
        footer={
          <>
            <Button
              disabled={isLoadingReturnItem}
              variant="outlined"
              onClick={closeReturnModal}
              sx={{ marginRight: 2 }}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoadingReturnItem}
              variant="contained"
              color="error"
              onClick={handleReturnItem}
            >
              Confirm
            </Button>
          </>
        }
      >
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <InputLabel style={{ color: "black" }}>
            Select a reason for return
          </InputLabel>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            displayEmpty
            error={!!errors.reason}
            sx={{ marginBottom: 1 }}
          >
            <MenuItem value="" disabled>
              Select a reason for return
            </MenuItem>
            {reasons.map((reasonOption) => (
              <MenuItem key={reasonOption} value={reasonOption}>
                {reasonOption}
              </MenuItem>
            ))}
          </Select>
          {errors.reason && (
            <p style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.reason}
            </p>
          )}

          <TextField
            label="Additional Remarks (required for 'Other Reason')"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value.slice(0, 100))}
            fullWidth
            multiline
            rows={3}
            error={!!errors.remarks}
            helperText={`${100 - remarks.length} characters remaining`}
          />
          {errors.remarks && (
            <p style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.remarks}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
