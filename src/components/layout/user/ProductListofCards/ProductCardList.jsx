'use client'

import React from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import ProductCard from "../../../common/productCard/ProductCard"

const ProductCardList = ({ productData = [], Heading = '' }) => {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div className="p-2 my-6 mx-auto">
      {/* Section Heading */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-4xl font-extrabold">{Heading}</h2>
      </div>

      {/* Product Grid */}
      <motion.div
        ref={ref}
        className="mx-auto grid gap-y-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {productData.length > 0 &&
          productData.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  )
}

export default React.memo(ProductCardList)

import PropTypes from "prop-types";

ProductCardList.propTypes = {
  productData: PropTypes.arrayOf(
    PropTypes.any
  ), // Array of product objects, defaults to an empty array
  Heading: PropTypes.string, // Required heading for the component
};