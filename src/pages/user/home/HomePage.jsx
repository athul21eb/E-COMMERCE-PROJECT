import { useGetNewArrivalsQuery } from "../../../slices/public/PublicApiSlice";
import PopularBrands from "../../../components/layout/user/popularBrands/PopularBrands";
import ProductList from "../../../components/layout/user/ProductListofCards/ProductCardList.jsx";
import Carousel from "../../../components/layout/user/carouselHomepage/Carousel.jsx";
import CategoryBanner from "../../../components/layout/user/categoryBanner/Banner.jsx";
import MostProducts from "../../../components/layout/user/MostProducts/MostProducts.jsx";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen.jsx";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Homepage = () => {
  const {
    data: { newArrivals = [], mostWishlisted = [], mostDelivered = [] } = {},
    isLoading,
    isUninitialized,
    refetch,
  } = useGetNewArrivalsQuery({
    limit: 10,
  });

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading && isUninitialized) {
    return <LoadingFullScreen />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Carousel />

      <CategoryBanner />

      {/* New Arrivals Section with Slide Up and Sideways Text */}
      {newArrivals.length && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 1, // Delay f1smooth upward slide
            }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 lg:mb-0"
          >
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              New <span className="text-gray-500">Arrivals</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-500 mt-3">
              Grab the new Ones
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 1, // Delay f1smooth fade-in
            }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <ProductList productData={newArrivals} />
          </motion.div>

          <div className="md:flex md:justify-evenly mb-10">
            {/* Most Loved Section */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 1, // Delay f1smooth slide-in from left
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MostProducts productData={mostWishlisted} Heading="Most Loved" bgcolor="red" />
            </motion.div>

            {/* Most Delivered Section */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 1, // Delay f1smooth slide-in from right
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MostProducts productData={mostDelivered} />
            </motion.div>
          </div>
        </>
      )}

      <PopularBrands />
    </div>
  );
};

export default Homepage;
