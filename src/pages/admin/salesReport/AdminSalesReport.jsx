import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";
import { useLazyGetSaleReportQuery } from "../../../slices/admin/order/orderApiSlice";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import RenderPagination from "../../../components/common/Pagination/RenderPagination";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import { useTheme } from "../../../contexts/themeContext";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the AutoTable plugin

import * as XLSX from "xlsx"; // For Excel generation

const AdminSaleReport = () => {
  const navigate = useNavigate();
  const { themeStyles, theme } = useTheme();
  const [fetchOrders, { isLoading, data, isFetching }] =
    useLazyGetSaleReportQuery();
  const [orders, setOrders] = useState(data?.orders ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(
    data?.totalOrders ?? 1
  );
  const itemsPerPage = 3;
  const [period, setPeriod] = useState("day");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchOrdersData = async () => {
    try {
      const params = {
        currentPage,
        itemsPerPage,
        period,
      };

      if (period === "custom") {
        if (!startDate || !endDate) {
          toast.error("Please select both start and end dates.");
        }
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await fetchOrders(params).unwrap();
      console.log(res);
      const {
        salesReport: { orders, totalOrders },
      } = res;
      setTotalOrdersCount(totalOrders);
      setOrders(orders);
    } catch (err) {
      console.error(err);
      setTotalOrdersCount(1);
      setOrders(null);
    }
  };

  useEffect(() => {
    if (period !== "custom") {
      fetchOrdersData();
    }
  }, [period, currentPage]);

  if (isLoading || isFetching) {
    return <LoadingScreen />;
  }

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    if (event.target.value !== "custom") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const validateDates = (startDate, endDate) => {
    const now = new Date();
    if (!startDate || !endDate) {
      return"Please select both start and end dates.";
    }
    // Check if start date is in the future
    if (startDate && new Date(startDate) > now) {
      return "Start date cannot be in the future.";
    }
    if (endDate && new Date(endDate) > now) {
      return "endDate date cannot be in the future.";
    }

    // Check if start date is later than end date
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return "Start date cannot be later than end date.";
    }

    return null; // No validation errors
  };

  const handleFetch = () => {
    const error = validateDates(startDate, endDate); // Pass dates here
    if (error) {
      toast.error(error);
      return;
    }
    fetchOrdersData();
  };

  const headers = [
    "Order ID",
    "Order Amount",
    "Coupon Discount",
    "Discount on MRP",
    "Payment Details",
    "Date",
  ];

  const rows = orders?.map((order) => [
    order.orderId,
    `₹${order.billAmount}`,
    `₹${order.appliedCouponAmount}`,
    `₹${order.items.reduce(
      (acc, item) => acc + (item.appliedOfferAmount || 0),
      0
    )}`,
    <>
      <Typography variant="body2" sx={{ color: themeStyles.textPrimary }}>
        Method: {order.payment.method}
      </Typography>
      <Typography variant="body2" sx={{ color: themeStyles.textSecondary }}>
        Status: {order.payment.status}
      </Typography>
    </>,
    format(new Date(order.orderDate), "dd MMM, yyyy"),
  ]);

    // Function to download the report as PDF
    const downloadPDF = () => {
      const doc = new jsPDF();
      doc.text("Sales Report", 20, 20);
      doc.autoTable({
        head: [headers],
        body: rows.map((row) => row.slice(0, -1)), // Exclude date for brevity
        startY: 30,
      });
      doc.save("sales_report.pdf");
    };
  
    // Function to download the report as Excel
    const downloadExcel = () => {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows.map((row) => row.slice(0, -1))]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
      XLSX.writeFile(wb, "sales_report.xlsx");
    };
  

  ////--------------------------------render component----------------

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: themeStyles.background,
        minHeight: "100vh",
      }}
    >
      <AdminBreadCrumbs />
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "1rem",
          color: themeStyles.textPrimary,
        }}
      >
        Sales Report
      </Typography>

      <Box
        sx={{
          marginBottom: "2rem",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow:
            theme === "light"
              ? "0 4px 12px rgba(0, 0, 0, 0.1)"
              : "0 4px 12px rgba(0, 0, 0, 0.4)",
          backgroundColor:
            theme === "light" ? themeStyles.surface : themeStyles.background,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <TextField
          select
          label="Select Period"
          value={period}
          onChange={handlePeriodChange}
          sx={{
            width: "100%",
            maxWidth: "400px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
            },
            "& .MuiInputLabel-root": {
              color: theme === "light" ? "#555" : "#aaa",
            },
          }}
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
          <MenuItem value="custom">Custom Date</MenuItem>
        </TextField>

        {period === "custom" && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{
                flex: "1 1 auto",
                minWidth: "200px",
                maxWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
                },
                "& .MuiInputLabel-root": {
                  color: theme === "light" ? "#555" : "#aaa",
                },
              }}
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{
                flex: "1 1 auto",
                minWidth: "200px",
                maxWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
                },
                "& .MuiInputLabel-root": {
                  color: theme === "light" ? "#555" : "#aaa",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleFetch}
              sx={{
                padding: "0.7rem 1.5rem",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "0.9rem",
                backgroundColor: theme === "light" ? "#1976d2" : "#2196f3",
                color: "#fff",
                boxShadow:
                  theme === "light"
                    ? "0px 4px 6px rgba(25, 118, 210, 0.2)"
                    : "0px 4px 6px rgba(33, 150, 243, 0.3)",
                "&:hover": {
                  backgroundColor: theme === "light" ? "#1565c0" : "#1e88e5",
                },
              }}
            >
              Fetch
            </Button>
          </Box>
        )}
      </Box>

      <Paper
        elevation={2}
        sx={{
          backgroundColor: themeStyles.surface,
          color: themeStyles.textPrimary,
          marginBottom: "1rem",
        }}
      >
        {(!orders || orders.length === 0) && (
    <Typography sx={{ textAlign: "center", fontSize: "2.5rem", marginY: "1.25rem" }}>
    No orders found for the selected period.
  </Typography>
  
       
        )}
        <ReusableTable headers={headers} rows={rows} />

       <div className="p-5">
       <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={downloadPDF}
          sx={{ borderRadius: "10px" }}
        >
          Download PDF
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={downloadExcel}
          sx={{ borderRadius: "10px" }}
        >
          Download Excel
        </Button>
      </Box>
       </div>
      </Paper>

      {orders && orders.length > 0 && (
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalOrdersCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    
    </div>
  );
};

export default AdminSaleReport;
