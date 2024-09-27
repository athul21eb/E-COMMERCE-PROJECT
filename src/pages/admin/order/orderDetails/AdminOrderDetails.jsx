import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyGetOrderByIdFromAllOrdersQuery, useUpdateOrderItemStatusMutation } from "../../../../slices/admin/order/orderApiSlice";
import AdminBreadCrumbs from "../../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import Modal from "../../../../components/common/Modals/Modal";
import { format } from "date-fns";
import BackButton from "../../../../components/common/ReusableButton/BackButton";

// Status priority
const statusPriority = { "Pending": 1, "Shipped": 2, "Delivered": 3, "Cancelled": 4 };

const AdminOrderDetails = () => {
  const [getOrderDetailsById] = useLazyGetOrderByIdFromAllOrdersQuery();
  const [updateOrderItemStatus] = useUpdateOrderItemStatusMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedItem(null);
    setNewStatus("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getOrderDetailsById(id).unwrap();
      setOrder(response.order);
    } catch (err) {
      console.error(err);
    }
  };

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
      await updateOrderItemStatus({ orderId: order._id, itemId: selectedItem._id, status: newStatus }).unwrap();
      fetchData(); // Refresh the order details after updating
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box padding={2}>
      <AdminBreadCrumbs />
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <BackButton className="mb-4 bg-slate-600" />

      {/* Top Row - Order Info */}
      <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px", borderRadius: "8px", backgroundColor: "black", color: "white" }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={2}>
            <Typography variant="body2">Order Date</Typography>
            <Typography variant="h6">{format(new Date(order.orderDate), 'dd MMM, yyyy')}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">Order ID</Typography>
            <Typography variant="h6">#{order.orderId}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">Ship To</Typography>
            <Typography variant="h6">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="body2">Total</Typography>
            <Typography variant="h6">₹{order.billAmount}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Order Items */}
      {order.items.map((item, index) => (
        <Paper key={index} elevation={3} style={{ padding: "16px", marginBottom: "16px", borderRadius: "8px" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <img
                src={item.productId?.thumbnail}
                alt={item.productId?.productName}
                style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography variant="h6">{item.productId?.productName}</Typography>
              <Typography variant="body2">Category: {item.productId?.category?.categoryName}</Typography>
              <Typography variant="subtitle1">Price: ₹{item.productId?.salePrice}</Typography>
              <Typography variant="body2">Size: {item.size}</Typography>
              <Typography variant="body2">Quantity: {item.quantity}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
            {order.shippingAddress && (
                      <>
                        <Typography variant="body2" component="span">
                            
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.district},{" "}
                          {order.shippingAddress.state}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          PIN: {order.shippingAddress.pincode}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          {order.shippingAddress.landmark}
                        </Typography>
                      </>
                    )}
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography
                variant="h6"
                color={getStatusColor(item.status)}
                style={{ marginBottom: "16px" }}
              >
                Status: {item.status}
              </Typography>

              {/* Conditional Buttons */}
              {canChangeStatus(item.status) && (
                <>
                  {item.status === "Pending" && (
                    <>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleChangeStatus(item, "Shipped")}
                      sx={{marginBottom:"10px"}}
                    >
                      Mark as Shipped
                    </Button>
                   <br/>
                      <Button
                     
                      variant="contained"
                      color="error"
                      onClick={() => handleChangeStatus(item, "Cancelled")}
                    >
                      Cancel Item
                    </Button>
                    </>
                  )}
                  {item.status === "Shipped" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleChangeStatus(item, "Delivered")}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  
                </>
              )}
            </Grid>
          </Grid>

          {/* Delivery Info and Status aligned to the right */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Box>
              <Typography variant="body1">
                Delivery on: {format(deliveryDate, 'dd MMM, yyyy')}
              </Typography>
            </Box>
            <Button variant="text" color="primary">
              Invoice
            </Button>
          </Box>
        </Paper>
      ))}

      {/* Modal for Confirming Status Change */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirm Status Change"
        footer={
          <>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmStatusChange}
            >
              Confirm
            </Button>
          </>
        }
      >
        <Typography>Are you sure you want to change the status to "{newStatus}"?</Typography>
      </Modal>
    </Box>
  );
};

export default AdminOrderDetails;
