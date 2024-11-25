import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "../../../common/productCard/ProductCard"; // Import the ProductCard component

import { Range, getTrackBackground } from "react-range"; // For price slider

// Mock product data (you would fetch from an API)

import { TbFilter } from "react-icons/tb";
import { useGetAllBrandsListQuery } from "../../../../slices/public/PublicApiSlice";
import LoadingFullScreen from "../../../common/LoadingScreens/LoadingFullScreen";
import { useNavigate } from "react-router-dom";
import RenderPagination from "../../../common/Pagination/RenderPagination";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger effect between children
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AllProductsListComponent = ({
  ComponentProducts = null,
  Heading = "SHOP ALL",
  states: [
    sortOption,
    setSortOption,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalCount,
    searchQuery,
  ],
}) => {
  const { data: { brands = [] } = {}, isLoading } = useGetAllBrandsListQuery();

  const navigate = useNavigate();
  // Sidebar Filters
  // Sample brands
  const SORT_OPTIONS = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "aA-zZ",
    "zZ-aA",
  ];

  const toggleBrand = useCallback(
    (brand) => {
      if (selectedBrands.includes(brand)) {
        setSelectedBrands(selectedBrands.filter((b) => b !== brand));
      } else {
        setSelectedBrands([...selectedBrands, brand]);
      }
    },
    [selectedBrands, setSelectedBrands]
  );

  const handleSortChange = useCallback(
    (e) => {
      setSortOption(e.target.value);
    },
    [setSortOption]
  );

  const [showAll, setShowAll] = useState(false); // Toggle state to show more/less brands

  // Determine how many brands to show initially
  const visibleBrands = showAll ? brands : brands.slice(0, 4);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleResetFilters = () => {
    // Reset the selected brands, price range, and sort option to default values
    setSelectedBrands([]); // Reset selected brands
    setPriceRange([500, 40000]); // Reset price range to default values
    setSortOption("");
    searchQuery;
    // Reset sort option
    // Refetch products with default filters
  };

  ////----------------------------------rendering component------------
  if (isLoading) return <LoadingFullScreen />;

  return (
    <div className="flex flex-col md:flex-row p-4">
      {/* Sidebar */}
      <div className="w-full hidden md:block md:w-1/4 p-4  items-center">
        {/* Brands Filter */}
        <div className="my-5 mr-10">
          <h1 className="text-2xl font-bold flex mb-5">
            <TbFilter className="mr-2 size-11" />
            FILTER
          </h1>

          <h3 className="text-lg font-semibold mb-2">Brands</h3>
          <div className="flex flex-col space-y-2">
            {!isLoading &&
              visibleBrands.map((brand) => (
                <label
                  key={brand?.brandName}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand?._id)}
                    onChange={() => toggleBrand(brand?._id)}
                    className="form-checkbox"
                  />
                  <span>{brand?.brandName}</span>
                </label>
              ))}
          </div>

          {/* Toggle between showing more or less */}
          {brands.length > 4 && (
            <button
              className="text-blue-500 hover:text-blue-700 mt-2"
              onClick={toggleShowAll}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mx-6">
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <Range
            step={100}
            min={500}
            max={40000}
            values={priceRange}
            onChange={(values) => setPriceRange(values)}
            renderTrack={({ props, children }) => {
              const { key, ...rest } = props; // Destructure to avoid spreading key
              return (
                <div
                  {...rest}
                  style={{
                    ...rest.style,
                    height: "6px",
                    width: "80%",
                    background: getTrackBackground({
                      values: priceRange,
                      colors: ["#ccc", "#548BF4", "#ccc"],
                      min: 500,
                      max: 40000,
                    }),
                  }}
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props, index }) => {
              const { key, ...rest } = props; // Destructure to avoid spreading key
              return (
                <div
                  key={index}
                  {...rest}
                  style={{
                    ...rest.style,
                    height: "16px",
                    width: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#548BF4",
                  }}
                />
              );
            }}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>

        {/* Reset Filters Button */}
<div className="flex justify-start mt-4">
  <button
    onClick={handleResetFilters}
    className="px-6 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-all"
  >
    Reset Filters
  </button>
</div>


      </div>

      {/* Product Grid and Sorting */}
      <div className="w-full md:w-3/4 md:border-l-4">
        {/* Sorting */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl md:text-5xl  font-mono font-extrabold  p-10">
            {Heading}
          </h2>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border p-2 mx-2 rounded-md border-black"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}

        {ComponentProducts && ComponentProducts.length ? (
  <motion.div
    className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 p-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {ComponentProducts.map((product) => (
      <motion.div key={product._id} variants={childVariants}>
        <ProductCard product={product} />
      </motion.div>
    ))}
  </motion.div>
): searchQuery ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-4">
              You searched for '{searchQuery}'
            </div>
            <p className="text-gray-500 text-lg mb-4">
              Sorry, we couldn't find any results for your search.
            </p>
            <p className="text-gray-500 text-lg mb-6">
              Try searching for something more generic, or explore our popular
              categories below.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all"
            >
              reset Search
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-3xl font-semibold text-gray-700 mb-4">
              No Products Found!
            </div>
            <p className="text-gray-500 text-lg mb-6">
              Try adjusting your filters or search for something else.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination can be added here */}
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalCount}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

AllProductsListComponent.propTypes = {
  ComponentProducts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      salePrice: PropTypes.number.isRequired,
      thumbnail: PropTypes.string.isRequired,
      gallery: PropTypes.arrayOf(PropTypes.string.isRequired),
    })
  ),
  Heading: PropTypes.string,
  states: PropTypes.arrayOf(PropTypes.any).isRequired, // Array of state hooks used in the component
};


export default AllProductsListComponent;
