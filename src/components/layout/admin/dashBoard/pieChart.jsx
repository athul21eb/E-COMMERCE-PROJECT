import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTheme } from "../../../../contexts/themeContext";
import { motion } from "framer-motion";
import useWindowSize from "../../../../hooks/useWindowSize";

const COLORS = [
  "#3498db", // Blue
  "#e74c3c", // Red
  "#2ecc71", // Green
  "#f39c12", // Orange
  "#9b59b6", // Purple
  "#1abc9c", // Teal
  "#34495e", // Dark Blue
  "#ecf0f1", // Light Grey
  "#95a5a6", // Grey
  "#e67e22", // Carrot Orange
  "#16a085", // Dark Teal
  "#c0392b", // Dark Red
  "#8e44ad", // Dark Purple
  "#d35400", // Pumpkin Orange
  "#27ae60", // Dark Green
];

const PieChartComponent = ({ data }) => {
  const { theme } = useTheme();
  const isDarkMode = theme !== "light";

  const processedData = useMemo(() => {
    const total = data?.reduce((sum, item) => sum + item.count, 0);
    return data?.map((item) => ({
      ...item,
      percentage: (item.count / total) * 100,
    }));
  }, [data]);

  const { width } = useWindowSize();

  const getChartHeight = () => {
    if (width < 600) return 200; // Small screen
    if (width < 900) return 250; // Medium screen
    return 300; // Large screen
  };

  const chartHeight = getChartHeight();

  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const backgroundColor = isDarkMode ? "#1A202C" : "#FFFFFF";

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={isDarkMode ? "#FFFFFF" : "#000000"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: chartHeight,
          backgroundColor: backgroundColor,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isDarkMode
            ? "0 4px 6px rgba(255, 255, 255, 0.1)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ color: textColor, fontSize: "16px", fontWeight: "bold" }}>
          No data available
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        height: chartHeight+100,
        backgroundColor: backgroundColor,
        borderRadius: "8px",
        padding: "16px",
        boxShadow: isDarkMode
          ? "0 4px 6px rgba(255, 255, 255, 0.1)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{ textAlign: "center", color: textColor, marginBottom: "20px" }}
        className="text-lg md:text-4xl text-start"
      >
        Order Item Status Distribution
      </h1>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={chartHeight * 0.4}
            fill="#8884d8"
            dataKey="percentage"
            label={CustomLabel}
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={isDarkMode ? "#FFFFFF" : "#000000"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value.toFixed(1)}% (${props.payload.count} orders)`,
              props.payload.status,
            ]}
            contentStyle={{
              backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
              color: textColor,
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          />
          {chartHeight>200&&<Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry) => (
              <span
                style={{
                  color: textColor,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {entry.payload.status} ({entry.payload.percentage.toFixed(1)}%)
              </span>
            )}
          />}
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PieChartComponent;
