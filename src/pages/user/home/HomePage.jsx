import { useLazyGetAllProductListQuery } from "../../../slices/public/PublicApiSlice";

import PopularBrands from "../../../components/layout/user/popularBrands/PopularBrands";
import Banner from "../../../components/layout/user/banners/Banner";
import ProductList from "../../../components/layout/user/ProductListofCards/ProductCardList.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Homepage = () => {
  const [triggerProductList] = useLazyGetAllProductListQuery();

  useEffect(() => {
    triggerProductList();
  }, [triggerProductList]);

  const { products } = useSelector((state) => state.public);

  return (
    <div className="px-6 pt-6 mt-20 sm:px-6 lg:px-8">
      <PopularBrands />
      <Banner bannerImg={"./Banner1.svg"} />
      <ProductList
        productData={products.slice(0, 8)}
        Heading={"New Arrivals"}
      />
      <Banner bannerImg={"./banner1.png"} />
      <ProductList
        productData={products.slice(0, 8).sort()}
        Heading={"Best Sellers"}
      />
    </div>
  );
};

export default Homepage;
