import React from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Dummy data for the carousel items
const items = [
  {
    id: 1,
    _id:"66ce27bbd18a61b1b9e89270",
    title: "PUMA ULTRA X F1 VEGAS",
    subtitle:"Limited drop inspired by the Las Vegas Grand Prix",
    imgSrc:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257756/hero-banner-d-puma-ultra-f1-1-121124_jixoz5.avif", // Replace with your image URL
  },
  {
    id: 2,
    _id:"6740259852b51b97a894231a",
    title: "Nike Mercurial Cosmic Speed 2",
    subtitle: "limited time edition is dropped",
    imgSrc:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257770/hero-banner-d-nike-cosmicspeed2-2-plain_uig3qr.avif", // Replace with your image URL
  },
  {
    id: 3,
    _id:"67371e899babf1cfd2a40f95",
    title: "ADIDAS PREDATOR ",
    subtitle: "physics with boots  ",
    imgSrc:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257310/banner-d-ote-boots-3-plain_allcch.jpg", // Replace with your image URL
  },
  {
    id: 4,
    _id:"66cc50cfcf18045ece8524a6",
    title: "ADIDAS OLD RETRO ",
    subtitle: "FELL THE POWER OF RETRO",
    imgSrc:
      "https://res.cloudinary.com/dmrvutjac/image/upload/v1732257344/herobannerdcopadb_h5ve48.avif", // Replace with your image URL
  },
  {
    id: 5,
    _id:"6740246b52b51b97a89422fa",
    title: "ADIDAS F50+ ELITE ‘VIVID HORIZON’",
    subtitle: "Built for maximum speed on pitch",
    imgSrc:
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

const ProductCarousel = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full max-w-screen-xl mx-auto mb-2">
      <Slider {...settings}p>
        {items.map((item) => (
          <div key={item.id} className="relative">
            <img
              src={item.imgSrc}
              alt={item.title}
              className="w-full h-64 sm:h-96 md:h-3/4 object-cover"
            />
            {/* Gradient overlay to dim the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-5 right-5 left-5 flex flex-col justify-end px-10">
              <div className="flex flex-col  items-center md:flex-row md:justify-between w-full">
                <div>
                  <h2 className="text-white text-md md:text-4xl font-bold mb-2 text-center">
                    {item.title}
                  </h2>
                  <p className="text-white text-xs md:text-lg text-center md:text-justify">

                    {item.subtitle}
                  </p>
                </div>
                <button onClick={()=>navigate(`/product-details?id=${item._id}`)} className="mt-4 md:mt-0 p-1 md:px-6 md:py-3 border border-white text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 ease-in-out">
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
