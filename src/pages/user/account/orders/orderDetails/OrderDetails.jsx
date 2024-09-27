import React from "react";
import { Box, Typography, Button, Grid, Paper, Divider } from "@mui/material";
import BackButton from "../../../../../components/common/ReusableButton/BackButton";
import Modal from "../../../../../components/common/Modals/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCancelOrderItemMutation,
  useLazyGetOrderByIdQuery,
} from "../../../../../slices/user/orders/orderApiSlice";
import { useEffect, useState } from "react";
import { format } from "date-fns";


const OrderList = () => {
  ////mutations and queries
  const [getOrderDetailsById] = useLazyGetOrderByIdQuery();
  const [cancelItem] = useCancelOrderItemMutation();
  ////query params
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  ////states
  const [order, setOrder] = useState(null);
const [cancellingItemId,setCancellingItemId] = useState(null);
    //model setup

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  /////api calls
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
      const response = await cancelItem({ itemId:cancellingItemId, orderId: id }).unwrap();
      setCancellingItemId(null);
     fetchData();
      closeModal();
    } catch (err) {
      // Display error message in case of failure

      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, []);

  const deliveryDate = new Date(order?.orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  if (!order || !order.items || order.items.length === 0) {
    return <Typography variant="body1">No items in this order.</Typography>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Shipped":
        return "blue";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <Box padding={2}>
      <BackButton className="mb-4 bg-slate-600" />

      {/* Top Row - Order Info */}
      <Paper
        elevation={3}
        style={{
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "8px",
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={2}>
            <Typography variant="body2">Order Date</Typography>
            <Typography variant="h6">
              {format(new Date(order.orderDate), 'dd MMM, yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">Order ID</Typography>
            <Typography variant="h6">#{order.orderId}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">Ship To</Typography>
            <Typography variant="h6">
              {order?.shippingAddress?.firstName}{" "}
              {order?.shippingAddress?.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="body2">Total</Typography>
            <Typography variant="h6">₹{order?.billAmount}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Order Items */}
      {order?.items.map((item, index) => (
        <Paper
          key={index}
          elevation={3}
          style={{
            padding: "16px",
            marginBottom: "16px",
            borderRadius: "8px",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <img
                src={item.productId?.thumbnail}
                alt={item.productId?.productName}
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <Typography variant="h6">
                {item.productId?.productName}
              </Typography>
              <Typography variant="body2">
                Category: {item.productId?.category?.categoryName}
              </Typography>
              <Typography variant="subtitle1">
                Price: ₹{item.productId?.salePrice}
              </Typography>
              <Typography variant="body2">Size: {item.size}</Typography>
              <Typography variant="body2">Quantity: {item.quantity}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                color={getStatusColor(item?.status)}
                style={{ marginBottom: "16px" }}
              >
                Status: {item?.status}
              </Typography>

              {/* Conditional Buttons */}
              {item?.status === "Pending" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setCancellingItemId(item._id);
                    openModal();
                  }}
                >
                  Cancel Item
                </Button>
              )}
              {item?.status === "Delivered" && (
                <Button variant="contained" color="info">
                  Return Item
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Delivery Info and Status aligned to the right */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Box>
              <Typography variant="body1">
                Delivery on: {format(new Date(deliveryDate), 'dd MMM, yyyy')}
              </Typography>
            </Box>
            <Button variant="text" color="primary">
              Invoice
            </Button>
          </Box>
        </Paper>
      ))}

       <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Cancel Item"
            footer={
              <>
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelItem}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <p>Are you sure you to Cancel this Item?</p>
          </Modal>
    </Box>
  );
};

export default OrderList;
