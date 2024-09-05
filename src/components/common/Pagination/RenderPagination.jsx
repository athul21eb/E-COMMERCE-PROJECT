import React from "react";

const RenderPagination = ({
  currentPage,
  setCurrentPage,
  totalProductsCount,
  itemsPerPage,
  maxPageButtons = 1,
}) => {
  const totalPages = Math.ceil(totalProductsCount / itemsPerPage);
 

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Determine the start and end of the visible page range
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    // Adjust if we hit the lower or upper limit
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    // Add the first page and ellipsis if necessary
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Add the visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add the last page and ellipsis if necessary
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }
    if (endPage < totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <li key={index} className="mx-1">
        {typeof number === "number" ? (
          <button
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 border rounded ${
              currentPage === number
                ? "bg-black text-white"
                : "bg-gray-200 border-gray-300 text-black"
            }`}
          >
            {number}
          </button>
        ) : (
          <span className="px-3 py-1">{number}</span>
        )}
      </li>
    ));
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border border-gray-900 rounded ${
          currentPage === 1 ? "bg-gray-600 line-through" : "bg-blue-800 text-white"
        }`}
      >
        Previous
      </button>
      <ul className="flex space-x-1">{renderPageNumbers()}</ul>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border border-gray-900 rounded ${
          currentPage === totalPages ? "bg-gray-600 line-through" : "bg-blue-800 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default RenderPagination;
