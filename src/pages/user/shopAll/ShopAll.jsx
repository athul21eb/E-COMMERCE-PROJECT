import React, { useEffect, useState } from "react";
import AllProductsListComponent from "../../../components/layout/user/AllproductsComponent/AllProducts";
import { useSelector } from "react-redux";
import { useGetProductListWithFiltersAndSortQuery } from "../../../slices/public/PublicApiSlice";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen";
import { useLocation } from "react-router-dom";

const ShopAll = () => {
  const location = useLocation();

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search"); // Get the value of 'search' query param

  const { products: ComponentProducts } = useSelector((state) => state.public);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const itemsPerPage = 10;
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([500, 40000]); // Initial price range
  const [sortOption, setSortOption] = useState("");

  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500); // 1.5 seconds debounce time

    return () => clearTimeout(timer); // Clear timer on value change
  }, [priceRange]);

  // Using the API query
  const { data, isLoading, refetch, isFetching } =
    useGetProductListWithFiltersAndSortQuery({
      page: currentPage,
      limit: itemsPerPage, // Adjust limit as per your requirement
      selectedBrands: selectedBrands.join(","), // Convert array to string for API query
      minPrice: debouncedPriceRange[0],
      maxPrice: debouncedPriceRange[1],
      sortBy: sortOption,
      search: searchQuery || "",
    });

  useEffect(() => {
    if (data?.totalCount) {
      setTotalCount(data.totalCount);
    }
  }, [data]);

  // UseEffect to trigger refetch when filters or pagination change
  useEffect(() => {
    // Refetch the product list whenever the filter states or page change
    refetch();
  }, [
    selectedBrands,
    currentPage,
    debouncedPriceRange,
    sortOption,
    refetch,
    searchQuery,
  ]);

  if (isLoading) {
    return <LoadingFullScreen />;
  }
  return (
    <AllProductsListComponent
      ComponentProducts={ComponentProducts}
      states={[
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
      ]}
      Heading={searchQuery ? `Search Result of "${searchQuery}"` : "SHOP ALL"}
    />
  );
};

export default ShopAll;
