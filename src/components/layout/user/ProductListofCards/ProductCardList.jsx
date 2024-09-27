import React from "react";
import ProductCard from "../../../common/productCard/ProductCard";

const ProductCardList = ({ productData=[], Heading }) => {

  console.log(productData);
  return (
    <div className="p-2 my-6">
      {/* Section Heading */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">{Heading}</h2>
      </div>

      {/* Product Grid */}
      <div className="mx-auto grid gap-y-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5 ">
        {productData.length>0&&productData.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardList;
