// ReusableTable.js
import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Styled Table Container for Rounded Borders and Responsive Layout
const StyledTableContainer = styled(TableContainer)(() => ({
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  overflowX: "auto",
  margin: "auto",
  maxWidth: "95vw", // Responsive max width for small screens
}));

// Animation variants for rows with staggered effect
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay each row's animation
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
  
};

const ReusableTable = ({ headers, rows = [] }) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // Media query for mobile responsiveness

  return (
    <StyledTableContainer component={Paper} className="mb-10">
      <motion.div initial="hidden" animate="visible" variants={tableVariants}>
        <Table
          sx={{ minWidth: isMobile ? 320 : 650 }} // Responsive min width
          aria-label="animated table"
        >
          <TableHead>
            <TableRow component={motion.tr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "1rem" : "1.2rem", // Adaptive font size
                    border: "1px solid #ddd",
                    textAlign: "center",
                    backgroundColor: "#f9fafb",
                    color: "#333",
                    padding: isMobile ? "10px" : "16px", // Adaptive padding
                    textTransform: "capitalize", // Capitalize text
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  component={motion.tr}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  sx={{
                    "&:hover": { backgroundColor: "#f0f2f5" },
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align="center"
                      sx={{
                        borderBottom: "1px solid #ddd",
                        textAlign: "center",
                        fontSize: isMobile ? "0.85rem" : "1rem", // Adaptive font size for cells
                        color: "#555",
                        padding: isMobile ? "8px" : "14px", // Responsive padding
                      }}
                    >
                      {React.isValidElement(cell) ? cell : cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow component={motion.tr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <TableCell colSpan={headers.length} align="center" sx={{ color: "#888", padding: "20px", fontSize: "1rem" }}>
                  Empty Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </StyledTableContainer>
  );
};

// PropTypes for ReusableTable
ReusableTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
};

export default ReusableTable;
