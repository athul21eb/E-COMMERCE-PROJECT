import React, { useEffect, useState } from "react";
import { useGetGraphDataQuery } from "../../../../slices/admin/dashboard/adminDashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "../../../../contexts/themeContext";
import useWindowSize from "../../../../hooks/useWindowSize";



const Graph = () => {
  const { theme } = useTheme();
  const [period, setPeriod] = useState("monthly");
  const { data: graphData ,refetch } = useGetGraphDataQuery({ period });
  const { width } = useWindowSize();

console.log(graphData);
  useEffect(()=>{
refetch();
  },[period])
  // Dynamically adjust height based on screen width
  const getChartHeight = () => {
    if (width < 600) return 200; // Small screens
    if (width < 900) return 300; // Medium screens
    return 400; // Large screens
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
       <Typography variant="h5" align="left" gutterBottom>
        Revenue {period === "weekly" ? "by Day" : "by Month"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          
        }}
      >


     

        <Button
          variant="contained"
          onClick={() => setPeriod("weekly")}
          sx={{
            opacity: period === "weekly" ? 1 : 0.6,
            backgroundColor: theme === "light" ? "#1976d2" : "#90caf9",
            color: theme === "light" ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: theme === "light" ? "#1565c0" : "#64b5f6",
            },
          }}
        >
          Day Trend
        </Button>
        <Button
          variant="contained"
          onClick={() => setPeriod("monthly")}
          sx={{
            opacity: period === "monthly" ? 1 : 0.6,
            backgroundColor: theme === "light" ? "#1976d2" : "#90caf9",
            color: theme === "light" ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: theme === "light" ? "#1565c0" : "#64b5f6",
            },
          }}
        >
          Month Trend
        </Button>
      </Box>


      <ResponsiveContainer width="100%" height={getChartHeight()}>
        <BarChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={period === "weekly" ? "week" : "month"} />
          <YAxis tickFormatter={(value) => `₹${value}`} />
          <Tooltip
            formatter={(value) => `₹${value}`}
            labelFormatter={(label) =>
              period === "weekly" ? `Day: ${label}` : `Month: ${label}`
            }
          />
          <Bar
            dataKey="revenue"
            fill={theme === "light" ? "#8884d8" : "#bb86fc"}
            animationDuration={500}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default Graph;
