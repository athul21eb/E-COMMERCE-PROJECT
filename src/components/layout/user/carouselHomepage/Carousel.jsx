import React from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Dummy data for the carousel items
const items = [
  {
    id: 1,
    product:"66ce27bbd18a61b1b9e89270",
    title: "PUMA ULTRA X F1 VEGAS",
    subTitle:"Limited drop inspired by the Las Vegas Grand Prix",
    image:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257756/hero-banner-d-puma-ultra-f1-1-121124_jixoz5.avif", // Replace with your image URL
  },
  {
    id: 2,
    product:"6740259852b51b97a894231a",
    title: "Nike Mercurial Cosmic Speed 2",
    subTitle: "limited time edition is dropped",
    image:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257770/hero-banner-d-nike-cosmicspeed2-2-plain_uig3qr.avif", // Replace with your image URL
  },
  {
    id: 3,
    product:"67371e899babf1cfd2a40f95",
    title: "ADIDAS PREDATOR ",
    subTitle: "physics with boots  ",
    image:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257310/banner-d-ote-boots-3-plain_allcch.jpg", // Replace with your image URL
  },
  {
    id: 4,
    product:"66cc50cfcf18045ece8524a6",
    title: "ADIDAS OLD RETRO ",
    subTitle: "FELL THE POWER OF RETRO",
    image:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257344/herobannerdcopadb_h5ve48.avif", // Replace with your image URL
  },
  {
    id: 5,
    product:"6740246b52b51b97a89422fa",
    title: "ADIDAS F50+ ELITE ‘VIVID HORIZON’",
    subTitle: "Built for maximum speed on pitch",
    image:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257778/hero-banner-d-2-adidas-f50-two-horizons_uophn4.jpg" },
  
  
];

const settings = {
  infinite: true,

  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black p-2 rounded-full cursor-pointer z-10"
      onClick={onClick}
    >
      <FaArrowRight className="text-white w-5 h-5" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black p-2 rounded-full cursor-pointer z-10"
      onClick={onClick}
    >
      <FaArrowLeft className="text-white w-5 h-5" />
    </div>
  );
}



const ProductCarousel = ({items}) => {

  console.log(items);
  const navigate = useNavigate();
  return (
    <div className="relative w-full max-w-screen mx-auto mb-2">
      <Slider {...settings}p>
        {items&&items.map((item) => (
          <div key={item.product} className="relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 sm:h-96 md:h-3/4 object-cover"
            />
            {/* Gradient overlay to dim the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-5 right-5 left-5 flex flex-col justify-end px-10">
              <div className="flex flex-col  items-center md:flex-row md:justify-between w-full">
                <div>
                  <h2 className="text-white text-xs sm:text-sm md:text-4xl font-bold mb-2 text-center">
                    {item.title}
                  </h2>
                  <p className="text-white text-xs md:text-lg text-center md:text-justify">

                    {item.subTitle}
                  </p>
                </div>
                <button onClick={()=>navigate(`/product-details?id=${item.product}`)} className="mt-4 md:mt-0 p-1 md:px-6 md:py-3 border border-white text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 ease-in-out">
                  SHOP NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
