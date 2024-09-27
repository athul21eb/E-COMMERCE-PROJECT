import React from 'react';
import ProductCard from '../../../common/productCard/ProductCard';

// Dummy data for products
const products = [
  {
    id: 1,
    name: "Nike Mercurial Superfly",
    discount: "40% OFF",
    imgUrl: 'https://via.placeholder.com/150', // Placeholder for product image
    specialOffer: false
  },
  {
    id: 2,
    name: "Oslar 3.0 Football",
    discount: "35% OFF",
    imgUrl: 'https://via.placeholder.com/150', // Placeholder for product image
    specialOffer: false
  },
  {
    id: 3,
    name: "Dagger Football Boots",
    discount: "Special offer",
    imgUrl: 'https://via.placeholder.com/150', // Placeholder for product image
    specialOffer: true
  },
  {
    id: 4,
    name: "COPA PURE II CLUB",
    discount: "Min 50% OFF",
    imgUrl: 'https://via.placeholder.com/150', // Placeholder for product image
    specialOffer: true
  },
];

const MostProducts = ({productData ,bgcolor='blue',Heading='Most Popular'}) => {
  return (
    <div className={`py-8 px-4 sm:px-6 lg:px-8 bg-${bgcolor}-500 rounded-lg mb-10 md:mb-0`}>
      <h2 className="text-3xl text-white font-bold font-serif text-center mb-6">{Heading}</h2>
      {/* Responsive grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
      {productData.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MostProducts;
