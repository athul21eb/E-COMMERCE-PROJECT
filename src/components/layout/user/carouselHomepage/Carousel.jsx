import React from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// Dummy data for the carousel items
const items = [
  {
    id: 1,
    title: "ADIDAS F50+ ELITE ‘VIVID HORIZON’",
    subtitle: "Built for maximum speed on pitch",
    imgSrc:
      "https://www.prodirectsport.com/-/media/prodirect/project/en/soccer/billboards/standard/boots/adidas/hero-banner-d-adidas-vivid-horizon-170924.jpg", // Replace with your image URL
  },
  {
    id: 2,
    title: "DIADORA BRASIL CLASSICO",
    subtitle: "A tribute to AC Milan Legend George Weah",
    imgSrc:
      "https://www.prodirectsport.com/-/media/prodirect/project/en/soccer/billboards/standard/boots/other/diadora-weah--hero-banner-d-190924.jpg", // Replace with your image URL
  },
  {
    id: 1,
    title: "ADIDAS F50+ ELITE ‘VIVID HORIZON’",
    subtitle: "Built for maximum speed on pitch",
    imgSrc:
      "https://www.prodirectsport.com/-/media/prodirect/project/en/soccer/billboards/standard/boots/adidas/hero-banner-d-adidas-vivid-horizon-170924.jpg", // Replace with your image URL
  },
  {
    id: 2,
    title: "DIADORA BRASIL CLASSICO",
    subtitle: "A tribute to AC Milan Legend George Weah",
    imgSrc:
      "https://www.prodirectsport.com/-/media/prodirect/project/en/soccer/billboards/standard/boots/other/diadora-weah--hero-banner-d-190924.jpg", // Replace with your image URL
  },
  {
    id: 1,
    title: "ADIDAS F50+ ELITE ‘VIVID HORIZON’",
    subtitle: "Built for maximum speed on pitch",
    imgSrc:
      "https://www.prodirectsport.com/-/media/prodirect/project/en/soccer/billboards/standard/boots/adidas/hero-banner-d-adidas-vivid-horizon-170924.jpg", // Replace with your image URL
  },
  {
    id: 2,
    title: "DIADORA BRASIL CLASSICO",
    subtitle: "A tribute to AC Milan Legend George Weah",
    imgSrc:
      "https://www.prodirectsport.com/-/media/prodirect/project/en/soccer/billboards/standard/boots/other/diadora-weah--hero-banner-d-190924.jpg", // Replace with your image URL
  },
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
                  <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 text-center">
                    {item.title}
                  </h2>
                  <p className="text-white md:text-lg text-center md:text-justify">
                    {item.subtitle}
                  </p>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-3 border border-white text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 ease-in-out">
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
