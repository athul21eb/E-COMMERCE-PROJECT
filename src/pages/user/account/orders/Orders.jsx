import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { format } from "date-fns"; // Optional for date formatting
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import RenderPagination from "../../../../components/common/Pagination/RenderPagination";
import { useLazyGetOrdersForUserQuery } from "../../../../slices/user/orders/orderApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../../components/common/LoadingScreens/LoadingScreen";


const OrderTable = () => {
  const navigate = useNavigate();
  const [fetchOrders, { isLoading }] = useLazyGetOrdersForUserQuery();

  ////pagination States

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(1);
  const itemsPerPage = 2;

  const fetchOrdersData = async () => {
    try {
      const { orders, totalOrders } = await fetchOrders({
        currentPage,
        itemsPerPage,
      }).unwrap();
      if (totalOrdersCount) {
        console.log(orders, totalOrders);

        setTotalOrdersCount(totalOrders);
        if (orders) {
          setOrders(orders);
        }
      }
    } catch (err) {
      // Display error message in case of failure
     
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage]);

  ////status color
  
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
  /////---------------------------component-----------------------------------------------------------------------
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="order table"   sx={{
          // Collapse borders between cells
          '& td, & th': {
            border: '1px solid black', // Apply border to all cells
          },
        }}>
          <TableHead>
            <TableRow>
              <TableCell>ORDER ID</TableCell>
              <TableCell>PRODUCT</TableCell>
              <TableCell>ADDRESS</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="text-center py-4 text-3xl font-extrabold">
                  No Orders
                </td>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100"
                  onClick={() => navigate(`order-details?id=${order._id}`)}
                >
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
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
            backgroundColor: 'grey.400',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 1,
          }}
        >
          +{order.items.length - 2}
        </Avatar>
      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="Highlight"
                      textAlign="center"
                    >
                      {order.items.length}items
                    </Typography>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>

                  <TableCell>
                    {format(new Date(order.orderDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell> ₹ {order.billAmount}</TableCell>
                  <TableCell><Typography
                variant="subtitle2"
                color={getStatusColor(order.orderStatus)}
                style={{ marginBottom: "16px" }}
              > {order.orderStatus}
              </Typography></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <RenderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProductsCount={totalOrdersCount}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
};

export default OrderTable;
