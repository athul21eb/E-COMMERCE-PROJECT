import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Paper,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";
import { useLazyGetAllOrdersQuery } from "../../../slices/admin/order/orderApiSlice";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import RenderPagination from "../../../components/common/Pagination/RenderPagination";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import { useTheme  } from "../../../contexts/themeContext";


const AdminOrders = () => {
  const navigate = useNavigate();
  const { themeStyles,theme } = useTheme();
  const [fetchOrders, { isLoading, currentData, isFetching }] = useLazyGetAllOrdersQuery();
  const [orders, setOrders] = useState(currentData?.orders ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(currentData?.totalOrders ?? 1);
  const itemsPerPage = 5;

  const fetchOrdersData = async () => {
    try {
      const { orders, totalOrders } = await fetchOrders({
        currentPage,
        itemsPerPage,
      }).unwrap();
      setTotalOrdersCount(totalOrders);
      setOrders(orders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage]);

  if (isLoading || isFetching) {
    return <LoadingScreen />;
  }

  const headers = [
    "Order ID",
    "Product",
    "Address",
    "Date",
    "Price",
    "Payment Details",
  ];

  const rows = orders?.map((order) => [
    order.orderId,
    (
      <Box display="flex" alignItems="center">
        {order.items.slice(0, 2).map((product, i) => (
          <Avatar
            key={i}
            src={product.productId.thumbnail}
            alt={product.productId.productName}
            sx={{ width: 40, height: 40, marginRight: 1 }}
          />
        ))}
        {order.items.length > 2 && (
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: themeStyles.accent,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 1,
            }}
          >
            +{order.items.length - 2}
          </Avatar>
        )}
        <Typography variant="body2" sx={{ color: themeStyles.accent }} textAlign="center">
          {order.items.length} items
        </Typography>
      </Box>
    ),
    (
      <>
        <Typography variant="body2" sx={{ color: themeStyles.textPrimary }}>
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: themeStyles.textSecondary }}>
          {order.shippingAddress.city}, {order.shippingAddress.district},
          {order.shippingAddress.state}
        </Typography>
        <Typography variant="body2" sx={{ color: themeStyles.textSecondary }}>
          PIN: {order.shippingAddress.pincode}
        </Typography>
        <Typography variant="body2" sx={{ color: themeStyles.textSecondary }}>
          {order.shippingAddress.landmark}
        </Typography>
      </>
    ),
    format(new Date(order.orderDate), "dd MMM, yyyy"),
    `₹${order.billAmount}`,
    (
      <>
        <Typography variant="body2" sx={{ color: themeStyles.textPrimary }}>
          Method: {order.payment.method}
        </Typography>
        <Typography variant="body2" sx={{ color: themeStyles.textSecondary }}>
          Status: {order.payment.status}
        </Typography>
      </>
    ),
  ]);

  const navigateOrderDetails = (oid) => {
    navigate(`order-details?id=${oid}`);
  };


  ////--------------------------------render component----------------

  return (
    <div style={{ 
      padding: "1rem", 
      backgroundColor: themeStyles.background,
      minHeight: "100vh"
    }}>
      <AdminBreadCrumbs />
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: "bold", 
          marginBottom: "1rem",
          color: themeStyles.textPrimary
        }}
      >
        Order Management
      </Typography>
      <Paper 
        elevation={2}
        sx={{
          backgroundColor: themeStyles.surface,
          color: themeStyles.textPrimary,
          marginBottom: "1rem"
        }}
      >
        <ReusableTable 
          headers={headers} 
          rows={rows} 
          onClickOnRow={navigateOrderDetails}
         
        />
      </Paper>
      {orders && orders.length > 0 && (
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalOrdersCount}
          itemsPerPage={itemsPerPage}
          style={{
            color: themeStyles.textPrimary,
            '& .Mui-selected': {
              backgroundColor: themeStyles.accent,
              color: "#ffffff"
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminOrders;