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
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Table Container for Rounded Borders and Responsive Layout
const StyledTableContainer = styled(TableContainer)(() => ({
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflowX: "auto", // Enable horizontal scrolling for small screens
}));

const ReusableTable = ({ headers, rows = [] }) => {
  return (
    <StyledTableContainer component={Paper} className="mb-10">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.3rem", // Larger font size for headers
                  border: "1px solid #ddd",
                  textAlign: "center", // Center text inside cells
                  backgroundColor: "#f5f5f5",
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
                sx={{
                  "&:hover": {
                    backgroundColor: "#f0f0f0", // Change this to your desired hover color
                  },
                }}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    align="center"
                    sx={{
                      borderBottom: "1px solid #ddd", // Custom border style
                      textAlign: "center", // Center text inside cells
                      fontSize: "0.9rem",
                    }}
                  >
                    {React.isValidElement(cell)
                      ? cell // Render JSX element directly
                      : cell // Render cell data as string
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">
                Empty Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

// PropTypes for ReusableTable
ReusableTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of header strings
  rows: PropTypes.arrayOf(
    // Array of arrays
    PropTypes.arrayOf(PropTypes.any)
  ), // Rows contain either strings or JSX elements
};

export default ReusableTable;
