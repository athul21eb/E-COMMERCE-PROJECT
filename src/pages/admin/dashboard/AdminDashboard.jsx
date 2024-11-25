import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  MenuItem,
  TextField,
  Box,
  Button,
} from "@mui/material";
import {
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaBoxOpen,
} from "react-icons/fa";
import { useTheme } from "../../../contexts/themeContext";
import { useLazyGetDashBoardSummaryQuery } from "../../../slices/admin/dashboard/adminDashboardSlice";
import toast from "react-hot-toast";
import Graph from "../../../components/layout/admin/dashBoard/Graph";
import PieChart from "../../../components/layout/admin/dashBoard/pieChart";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";

const AdminDashboard = () => {
  const { theme, themeStyles } = useTheme();
  const [fetchSummary, { isLoading: summaryLoading,isUninitialized }] =
    useLazyGetDashBoardSummaryQuery();
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const fetchData = async () => {
    try {
      const res = await fetchSummary({ period, startDate, endDate }).unwrap();

      if (res) {
        setData(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (period !== "custom") {
      fetchData();
    }
  }, [period]);

  console.log(data);

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
      return "Please select both start and end dates.";
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
    fetchData();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  ////-------------------------------render component---------------------------

  if(isUninitialized||summaryLoading){
    return <LoadingScreen/>
  }
  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "light" ? "bg-gray-600" : "bg-gray-900"
      }`}
      style={{
        background: themeStyles.background,
        color: themeStyles.textPrimary,
      }}
    >
      <div className="container mx-auto space-y-8">
        <Typography
          variant="h4"
          style={{ color: themeStyles.textPrimary }}
          className="text-center"
        >
          Dashboard
        </Typography>

        <Box
          sx={{
            marginBottom: "1rem",
            padding: "0.75rem",
            borderRadius: "6px",
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.1)`,
            backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.75rem",
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
              maxWidth: "200px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                fontSize: "1em",
                padding: "0.3rem",
                color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
              },
              "& .MuiInputLabel-root": {
                color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                fontSize: "1rem",
              },
            }}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="custom">Custom Date</MenuItem>
          </TextField>

          {period === "custom" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // Stacked on small screens
                gap: "0.5rem",
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
                  minWidth: "100px",
                  maxWidth: { xs: "100%", md: "200px" }, // Full width on small screens
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                    backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                    fontSize: "0.8rem",
                    padding: "0.5rem",
                    color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                  },
                  "& .MuiInputLabel-root": {
                    color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                    fontSize: "0.75rem",
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
                  minWidth: "100px",
                  maxWidth: { xs: "100%", md: "200px" }, // Full width on small screens
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                    backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                    fontSize: "0.8rem",
                    padding: "0.5rem",
                    color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                  },
                  "& .MuiInputLabel-root": {
                    color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                    fontSize: "0.75rem",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleFetch}
                sx={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  backgroundColor: theme === "light" ? "#2196f3" : "#1976d2",
                  color: "#ffffff",
                  boxShadow: `0px 2px 4px rgba(33, 150, 243, 0.2)`,
                  "&:hover": {
                    backgroundColor: theme === "light" ? "#1976d2" : "#1565c0",
                  },
                }}
              >
                Fetch
              </Button>
            </Box>
          )}
        </Box>

        {/* Metrics Section */}
        <Grid container spacing={4}>
          {[
            {
              title: " Users Added",
              value: data?.totalUsers,
              icon: <FaUsers size={40} />,
            },
            {
              title: "Total Orders",
              value: data?.totalOrders,
              icon: <FaShoppingCart size={40} />,
            },
            {
              title: "Total Revenue",
              value: ` ₹${data?.totalRevenue.toLocaleString()}`,
              icon: <FaRupeeSign size={40} />,
            },
            {
              title: "Products Added",
              value: data?.totalProducts,
              icon: <FaBoxOpen size={40} />,
            },
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  style={{
                    background: themeStyles.surface,
                    color: themeStyles.textPrimary,
                    borderRadius: "15px",
                  }}
                >
                  <div className="flex flex-col items-center">
                    {/* Icon Section */}
                    <div
                      className="p-2 flex items-center justify-center rounded-full "
                      style={{ color: themeStyles.accent }}
                    >
                      {metric.icon}
                    </div>

                    {/* Content Section */}
                    <CardContent className="flex flex-col items-center justify-center">
                      <Typography variant="h6" className="text-center">
                        {metric.title}
                      </Typography>
                      <Typography variant="h4" className="text-center">
                        {metric.value}
                      </Typography>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12}>
           
             
              {/* Insert Pie Chart Component */}
              <PieChart data={data?.pieData}/>
           
          </Grid>
        </Grid>
        {/* Top Brands and Products */}
        <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
            <Card
              style={{
                background: themeStyles.surface,
                color: themeStyles.textPrimary,
              }}
            >
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Top Products
                </Typography>
                <List>
                  {data?.topProducts.length === 0 ? (
                    <Typography variant="subtitle2" className="mb-4">
                      No Products Available
                    </Typography>
                  ) : (
                    data?.topProducts.map((product, index) => (
                      <motion.div
                        key={index}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={product.productDetails.thumbnail}
                              alt={product.productDetails.productName}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={product.productDetails.productName}
                            secondary={`Total Sold: ${product.totalSold}`}
                            primaryTypographyProps={{
                              style: { color: themeStyles.textPrimary },
                            }}
                            secondaryTypographyProps={{
                              style: { color: themeStyles.textSecondary },
                            }}
                          />
                        </ListItem>
                        {index < data?.topProducts.length - 1 && <Divider />}
                      </motion.div>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              style={{
                background: themeStyles.surface,
                color: themeStyles.textPrimary,
              }}
            >
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Top Categories
                </Typography>
                <List>
                  {data?.topCategories?.length === 0 ? (
                    <Typography variant="subtitle2" className="mb-4">
                      No Categories Available
                    </Typography>
                  ) : (
                    data?.topCategories.map((brand, index) => (
                      <motion.div
                        key={brand._id}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={brand.brandPhotoUrl}
                              alt={brand.categoryName}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={brand.categoryName}
                            secondary={`Total Sold: ${brand.totalSold}`}
                            primaryTypographyProps={{
                              style: { color: themeStyles.textPrimary },
                            }}
                            secondaryTypographyProps={{
                              style: { color: themeStyles.textSecondary },
                            }}
                          />
                        </ListItem>
                        {index < data?.topBrands.length - 1 && <Divider />}
                      </motion.div>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              style={{
                background: themeStyles.surface,
                color: themeStyles.textPrimary,
              }}
            >
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Top Brands
                </Typography>
                <List>
                  {data?.topBrands?.length === 0 ? (
                    <Typography variant="subtitle2" className="mb-4">
                      No Brands Available
                    </Typography>
                  ) : (
                    data?.topBrands.map((brand, index) => (
                      <motion.div
                        key={brand._id}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={brand.brandPhotoUrl}
                              alt={brand.brandName}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={brand.brandName}
                            secondary={`Total Sold: ${brand.totalSold}`}
                            primaryTypographyProps={{
                              style: { color: themeStyles.textPrimary },
                            }}
                            secondaryTypographyProps={{
                              style: { color: themeStyles.textSecondary },
                            }}
                          />
                        </ListItem>
                        {index < data?.topBrands.length - 1 && <Divider />}
                      </motion.div>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div
              className="p-8 rounded-lg"
              style={{
                background: themeStyles.surface,
                color: themeStyles.textPrimary,
              }}
            >
              {/* Insert Bar Chart Component */}

              <Graph />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AdminDashboard;
