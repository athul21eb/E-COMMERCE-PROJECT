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
import { useTheme } from "../../../contexts/themeContext.jsx";

const StyledTableContainer = styled(TableContainer)(({ isDark }) => ({
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  overflowX: "auto",
  margin: "auto",
  maxWidth: "95vw",
  backgroundColor: isDark ? "#1e1e2f" : "#ffffff",
}));

const tableVariants = {
  hidden: { opacity: 0.95 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0.95, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "easeInOut" } },
};

const ReusableTable = ({ headers, rows = [], onClickOnRow }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { theme } = useTheme(); // Assuming `theme` is either 'dark' or 'light'
  const isDark = theme === 'dark';

  // Define color schemes for light and dark themes
  const colors = {
    dark: {
      background: "#1e1e2f",
      accent: "#3a3a4f",
      textPrimary: "#ffffff",
      textSecondary: "#a0a0b9",
      border: "#303044",
      surface: "#3e3e56",
      hover: "#52526b",
    },
    light: {
      background: "#ffffff",
      accent: "#f5f5f5",
      textPrimary: "#333333",
      textSecondary: "#555555",
      border: "#dddddd",
      surface: "#f9f9f9",
      hover: "#e0e0e0",
    },
  };

  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <StyledTableContainer component={Paper} isDark={isDark} className="mb-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tableVariants}
        style={{
          backgroundColor: themeColors.background,
          padding: "10px",
        }}
      >
        <Table
          sx={{ minWidth: isMobile ? 300 : 650 }}
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
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.accent,
                    color: themeColors.textPrimary,
                    padding: isMobile ? "10px" : "16px",
                    textTransform: "capitalize",
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
                  onClick={() => onClickOnRow(row[0])}
                  component={motion.tr}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    backgroundColor: themeColors.background,
                    "&:hover": { backgroundColor: themeColors.hover, color: themeColors.textPrimary },
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align="center"
                      sx={{
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderRight: cellIndex < row.length - 1 ? `1px solid ${themeColors.border}` : "none",
                        fontSize: isMobile ? "0.85rem" : "1rem",
                        color: themeColors.textSecondary,
                        padding: isMobile ? "8px" : "14px",
                      }}
                    >
                      {React.isValidElement(cell) ? cell : cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow component={motion.tr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <TableCell 
                  colSpan={headers.length} 
                  align="center" 
                  sx={{ 
                    color: themeColors.textSecondary, 
                    padding: "20px", 
                    fontSize: "1rem",
                    backgroundColor: themeColors.background,
                  }}
                >
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

ReusableTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  onClickOnRow: PropTypes.func,
};

export default ReusableTable;
