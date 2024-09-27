import { useGetNewArrivalsQuery } from "../../../slices/public/PublicApiSlice";

import PopularBrands from "../../../components/layout/user/popularBrands/PopularBrands";

import ProductList from "../../../components/layout/user/ProductListofCards/ProductCardList.jsx";

import Carousel from "../../../components/layout/user/carouselHomepage/Carousel.jsx";
import CategoryBanner from "../../../components/layout/user/categoryBanner/Banner.jsx";
import MostProducts from "../../../components/layout/user/MostProducts/MostProducts.jsx";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen.jsx";

const Homepage = () => {
  const { data, isLoading, isUninitialized } = useGetNewArrivalsQuery({
    limit: 10,
  });

  const products = data?.products || [];

  if (isLoading && isUninitialized) {
    return <LoadingFullScreen />;
  }
  return (
    <div className="px-4  sm:px-6 lg:px-8">
      <Carousel />

      <CategoryBanner />
      {products.length > 5 && (
        <>
          <div className="mb-6 lg:mb-0">
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              New <span className="text-gray-500"> Arrivals</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-500 mt-3">
              Grab the new Ones
            </p>
          </div>
          <ProductList productData={products} />
          <div className=" md:flex md:justify-evenly mb-10">
            <MostProducts
              productData={products.slice(0, 2)}
              Heading="Most Loved"
              bgcolor="red"
            />
            <MostProducts productData={products.slice(2, 4)} />
          </div>
        </>
      )}

      <PopularBrands />
    </div>
  );
};

export default Homepage;
