import { useGetNewArrivalsQuery } from "../../../slices/public/PublicApiSlice"
import PopularBrands from "../../../components/layout/user/popularBrands/PopularBrands"
import ProductList from "../../../components/layout/user/ProductListofCards/ProductCardList.jsx"
import Carousel from "../../../components/layout/user/carouselHomepage/Carousel.jsx"
import CategoryBanner from "../../../components/layout/user/categoryBanner/Banner.jsx"
import MostProducts from "../../../components/layout/user/MostProducts/MostProducts.jsx"
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen.jsx"
import { useEffect } from "react"
import { motion } from "framer-motion"

export default function Homepage() {
  const {
    data: { newArrivals = [], mostWishlisted = [], mostDelivered = [] } = {},
    isLoading,
    isUninitialized,
    refetch,
  } = useGetNewArrivalsQuery({
    limit: 10,
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoading && isUninitialized) {
    return <LoadingFullScreen />
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Carousel />

      <CategoryBanner />

      {newArrivals.length > 0 && (
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
              <MostProducts productData={mostWishlisted} Heading="Most Loved" bgcolor="red" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <MostProducts productData={mostDelivered} Heading="Most Delivered" bgcolor="blue" />
            </motion.div>
          </div>
        </>
      )}

     
        <PopularBrands />
      
    </div>
  )
}