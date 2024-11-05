import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const RenderPagination = ({
  currentPage,
  setCurrentPage,
  totalProductsCount,
  itemsPerPage,
  maxPageButtons = 5,
}) => {
  const totalPages = Math.ceil(totalProductsCount / itemsPerPage);

  // Hide pagination if there's only one page
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }
    if (endPage < totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <li key={index} className="mx-1">
        {typeof number === "number" ? (
          <motion.button
            onClick={() => handlePageChange(number)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              currentPage === number
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-200"
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
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-blue-600 hover:bg-blue-100"
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
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-blue-600 hover:bg-blue-100"
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
