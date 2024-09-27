import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import AllProductsListComponent from '../../../components/layout/user/AllproductsComponent/AllProducts'
import { useGetProductListWithFiltersAndSortQuery } from '../../../slices/public/PublicApiSlice';
import LoadingFullScreen from '../../../components/common/LoadingScreens/LoadingFullScreen';

const MenPage = () => {
 
  const { products: ComponentProducts } = useSelector((state) => state.public);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount,setTotalCount] = useState(1);
  const itemsPerPage= 10;
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([500, 40000]); // Initial price range
  const [sortOption, setSortOption] = useState("");

  // Using the API query
  const { data,isLoading, refetch } = useGetProductListWithFiltersAndSortQuery({
    page:currentPage,
    limit: itemsPerPage, // Adjust limit as per your requirement
    selectedBrands: selectedBrands.join(","), // Convert array to string for API query
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy: sortOption,
    selectedCategoryName:"Men"
  });


  useEffect(()=>{
    if(data?.totalCount){
      setTotalCount(data.totalCount);
    
    }
      },[data])

  // UseEffect to trigger refetch when filters or pagination change
  useEffect(() => {
    // Refetch the product list whenever the filter states or page change
    refetch();
  }, [selectedBrands, priceRange, sortOption, currentPage, refetch]);

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
        totalCount
      ]}
      Heading='MEN'
    />
  );
}

export default MenPage