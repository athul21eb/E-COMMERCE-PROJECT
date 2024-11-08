import React, { useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useTheme } from "../../../contexts/themeContext";

const RenderPagination = ({
  currentPage,
  setCurrentPage,
  totalProductsCount,
  itemsPerPage,
  maxPageButtons = 3,
}) => {
  const { theme } = useTheme();
  const totalPages = Math.ceil(totalProductsCount / itemsPerPage);


  useEffect(()=>{
    window.scrollTo(0, 0,{behavior: "smooth"} ); 
  },[currentPage]);

  // Light and Dark theme colors for the buttons
  const lightButtonColors = {
    activeBg: "bg-black text-white",
    inactiveBg: "bg-white text-black hover:bg-gray-200",
    disabledBg: "bg-gray-300 text-gray-500",
  };

  const darkButtonColors = {
    activeBg: "bg-blue-950 text-white",
    inactiveBg: "bg-gray-700 text-white hover:bg-gray-500",
    disabledBg: "bg-gray-600 text-gray-400",
  };

  const colors = theme === "light" ? lightButtonColors : darkButtonColors;

  // Hide pagination if there's only one page
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper function to add ellipses
  const addEllipses = (start, end, totalPages) => {
    const pageNumbers = [];

    // Always show the first page
    if (start > 1) {
      pageNumbers.push(1);
      if (start > 2) {
        pageNumbers.push("..."); // Add ellipses before the start
      }
    }

    // Show the page range in between
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Always show the last page
    if (end < totalPages - 1) {
      pageNumbers.push("...");
    }
    if (end < totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    // Adjust the start and end page when not enough pages on the left or right side
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    // Generate page numbers with the addEllipses function
    const pages = addEllipses(startPage, endPage, totalPages);

    return pages.map((number, index) => (
      <li key={index} className="mx-1">
        {typeof number === "number" ? (
          <motion.button
            onClick={() => handlePageChange(number)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              currentPage === number ? colors.activeBg : colors.inactiveBg
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {number}
          </motion.button>
        ) : (
          <span className="px-3 py-1 text-gray-500">{number}</span>
        )}
      </li>
    ));
  };

  return (
    <div className="flex flex-wrap justify-center items-center space-x-2 mt-4">
      <motion.button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
          currentPage === 1 ? colors.disabledBg : colors.inactiveBg
        }`}
        whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
      >
        {"<"}
      </motion.button>
      <ul className="flex flex-wrap justify-center space-x-1">{renderPageNumbers()}</ul>
      <motion.button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
          currentPage === totalPages ? colors.disabledBg : colors.inactiveBg
        }`}
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
      >
        {">"}
      </motion.button>
    </div>
  );
};

RenderPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalProductsCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  maxPageButtons: PropTypes.number,
};

export default RenderPagination;
