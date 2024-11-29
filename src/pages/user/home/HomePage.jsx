import { useQuery } from "@tanstack/react-query";
import PopularBrands from "../../../components/layout/user/popularBrands/PopularBrands";
import ProductList from "../../../components/layout/user/ProductListofCards/ProductCardList.jsx";
import Carousel from "../../../components/layout/user/carouselHomepage/Carousel.jsx";
import CategoryBanner from "../../../components/layout/user/categoryBanner/Banner.jsx";
import MostProducts from "../../../components/layout/user/MostProducts/MostProducts.jsx";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen.jsx";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";

const fetchNewArrivals = async () => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_FRONTEND_ENV === "development"
          ? import.meta.env.VITE_DEVELOPMENT_BACKEND_URL
          : import.meta.env.VITE_PRODUCTION_BACKEND_URL
      }/public//new-arrivals?limit=10`
    );
    return data; // Return valid data
  } catch (error) {
    // Log the error and rethrow it for React Query to catch
    console.error("Error fetching new arrivals:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch new arrivals"
    );
  }
};

export default function Homepage() {
  const {
    data = { newArrivals: [], mostDelivered: [], mostLoved: [], banners: [] },
    isLoading,
  } = useQuery({
    queryKey: ["newArrivals"], // Query key
    queryFn: fetchNewArrivals, // Fetch function
    refetchOnWindowFocus: false, // Disable refetch on window focus
    retry: 2, // Retry fetching twice before failing
  });

  if (isLoading) {
    return <LoadingFullScreen />;
  }

  const { newArrivals, mostDelivered, mostLoved, banners } = data;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {banners && banners?.length && <Carousel items={banners} />}
      <CategoryBanner />

      {newArrivals && newArrivals.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-6 lg:mb-0"
          >
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              New <span className="text-gray-500">Arrivals</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-500 mt-3">
              Grab the new Ones
            </p>
          </motion.div>

          <ProductList productData={newArrivals} />

          <div className="md:flex md:justify-evenly mb-10">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-6 md:mb-0"
            >
              <MostProducts
                productData={mostLoved}
                Heading="Most Loved"
                bgcolor="red"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <MostProducts
                productData={mostDelivered}
                Heading="Most Delivered"
                bgcolor="blue"
              />
            </motion.div>
          </div>
        </>
      )}

      <PopularBrands />
    </div>
  );
}
