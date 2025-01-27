import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLazyGetProductDetailsByIdQuery } from "../../../slices/public/PublicApiSlice";
import LoadingFullScreen from "../../../components/common/LoadingScreens/LoadingFullScreen";
import { AiOutlineWarning } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import ProductCardList from "../../../components/layout/user/ProductListofCards/ProductCardList";
import { IoBagOutline } from "react-icons/io5";
import {
  useAddToCartMutation,
  useLazyGetCartQuery,
} from "../../../slices/user/cart/cartApiSlice";
import {
  useLazyGetWishListQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../../slices/user/wishList/wishListApiSlice";
import { Tooltip } from "@mui/material";

const ProductsDetails = () => {
  const { cartDetails } = useSelector((state) => state.cart);
  const [refetchCart,{isLoading:CartLoading}] = useLazyGetCartQuery()
  const [refetchWishlist] = useLazyGetWishListQuery();
  const { user } = useSelector((state) => state.auth?.authInfo);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [addToCart, { isLoading: addToCartLoading, isError }] =
    useAddToCartMutation();
  const [
    fetchProductDetailsById,
    { isFetching, isLoading, isUninitialized, isError: isProductNotFound },
  ] = useLazyGetProductDetailsByIdQuery();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [stock, setStock] = useState(null);
  const [mainImageZoomOpen, setMainImageZoomOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);
  const navigate = useNavigate();
  const [totalStock, setTotalStock] = useState(0);
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const selectedStock = product?.stock.find((s) => s.size === size)?.stock;
    setStock(selectedStock);
    setInfoMessage(null);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };
  const fetchProductDetails = async () => {
    try {
      const response = await fetchProductDetailsById({ id }).unwrap();
      if (response) {
        setProduct(response.product);
        setMainImage(response.product?.thumbnail);
        setRelatedProducts(response.relatedProducts);

        // Set the initial main image
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductDetails();

    setSelectedSize(null);
    setStock(null);
  }, [id]);

  // useEffect to check if all stock is zero and set info message
  useEffect(() => {
    setInfoMessage(null);

    if (product) {
      // Calculate total stock
      const calculatedTotalStock = product?.stock?.reduce(
        (total, item) => total + Number(item.stock),
        0
      );
      setTotalStock(calculatedTotalStock);

      // Check if every item in stock has 0 quantity
      const isOutOfStock = product.stock.every(
        (item) => Number(item.stock) === 0
      );

      if (isOutOfStock) {
        setInfoMessage("Out of Stock");
      }
    }
  }, [product]);

  const handleThumbnailClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  ////Add to bag handle function

  const handleAddToBag = async () => {
    try {
      if (!user) {
        return navigate("/login");
      }

      if (!selectedSize) {
        setInfoMessage("Please select a size ");
        return;
      }

      if (stock === 0) {
        setInfoMessage("Out of Stock ! ");
        return;
      }

      const response = await addToCart({
        productId: id,
        quantity: 1,
        size: selectedSize,
      }).unwrap();

      await refetchCart();
      await refetchWishlist();
      toast.success(response.message);
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };
  ///// -------------wishlist ----------------------

  const [AddToWishlistApiCall, { isLoading: AddToWishlistLoading }] =
    useAddToWishlistMutation();
  const [RemoveFromWishlistApiCall, { isLoading: RemoveFromWishlistLoading }] =
    useRemoveFromWishlistMutation();

  const { wishListDetails } = useSelector((state) => state.wishlist);

  const [inWishlist, setInWishlist] = useState(
    wishListDetails?.products?.some((item) => item._id === product?._id)
  );

  const toggleWishlist = async (productId) => {
    try {
      if (!user) {
        return navigate("/login");
      }
      if (inWishlist) {
        await RemoveFromWishlistApiCall({ productId }).unwrap();
      } else {
        await AddToWishlistApiCall({ productId }).unwrap();
      }
    } catch (err) {
      // Display error message in case of failure

      console.error(err);
    }
  };
  useEffect(() => {
    if (wishListDetails) {
      setInWishlist(
        wishListDetails?.products?.some((item) => item._id === product?._id)
      );
    }
  }, [wishListDetails, toggleWishlist, id]);

  ////---------------------------component--------------------------------
  if (isLoading || isUninitialized || isFetching) {
    return <LoadingFullScreen />;
  }

  // If no product found, handle that case
  if (isError && isProductNotFound) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-lg mb-4">
          We couldn't find the product you were looking for.
        </p>
        {/* React Icon */}
        <AiOutlineWarning className="w-16 h-16 mb-4 text-red-500" />
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 ease-in-out"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 mt-20 mx-auto">
        <h2 className="text-3xl font-bold ml-5">Product Details</h2>
      </div>

      <div className="container mx-auto  p-4 max-w-full">
        <div className=" border-b-2 border-gray-500 pb-5 flex flex-col md:flex-row md:justify-evenly md:space-x-6">
          {/* Thumbnail Images */}
          <div className="flex flex-wrap md:flex-col md:align-middle md:space-y-4 space-x-4 md:space-x-0">
            {product?.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-24 h-32 object-cover rounded cursor-pointer border-2 border-transparent hover:border-gray-300"
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div
            onDoubleClick={() => setMainImageZoomOpen((m) => !m)}
            className="w-full md:w-3/6 flex justify-center items-center mt-6 md:mt-0"
          >
            {!mainImageZoomOpen ? (
              <Tooltip title="Double click to enable Zoom">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-[500px] object-contain rounded-lg"
                />
              </Tooltip>
            ) : (
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full h-[500px] object-contain rounded-lg"
                  />
                </TransformComponent>
              </TransformWrapper>
            )}
          </div>

          {/* Third Column for Details */}
          <div className="md:w-2/6 flex  flex-col  space-y-4 mt-6 md:mt-0">
            {/* Product Brand and Name */}
            <div className=" md:ms-10 text-center md:text-start">
              <h3 className="text-xl font-semibold text-gray-700">
                {product?.brand?.brandName}
              </h3>
              <h2 className="text-3xl font-bold">{product?.productName}</h2>
              <h5 className="text-xl font-semibold text-gray-700">
                {product?.category?.categoryName}
              </h5>

              <p className="text-gray-500 text-lg">5k Reviews</p>
            </div>

            {/* Pricing Section */}
            <div className="my-6">
              <div className="flex flex-col  justify-center md:justify-start items-center space-y-4 md:space-y-0 ">
                {/* Display Offer Information if offer is active */}
                {product?.offer &&
                new Date(product.offer?.endDate) >= Date.now() &&
                new Date(product.offer?.startDate) <= Date.now() ? (
                  <>
                    {/* Offer Price */}
                    <div className="text-3xl font-bold text-gray-800">
                      ₹{product.offerPrice}
                    </div>

                    {/* Sale Price (Strikethrough) and Discount Percentage */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-medium text-red-500 line-through">
                        (₹{product?.salePrice})
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {product.offer?.discountPercentage}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  /* If no offer, display only Sale Price */
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{product?.salePrice}
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="text-center">
              <h3 className="text-lg font-semibold">Select Size</h3>
              <div className="flex justify-center space-x-2 mt-2">
                {product?.stock.map((s) => (
                  <button
                    disabled={s.stock === 0}
                    key={s.size}
                    onClick={() => handleSizeSelect(s.size)}
                    className={`px-4 py-2 border rounded relative overflow-hidden ${
                      s.stock === 0
                        ? " text-gray-400 cursor-not-allowed"
                        : selectedSize === s.size
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {s.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[2px] bg-red-500 rotate-45"></div>
                      </div>
                    )}
                    {s.size}
                  </button>
                ))}
              </div>
              {stock === 0 ? (
                <p className="mt-2 text-lg text-red-500">Out of Stock!</p>
              ) : (
                stock > 0 && (
                  <p
                    className={`mt-2 text-sm ${
                      stock <= 10 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {stock} items left!
                  </p>
                )
              )}
              {infoMessage && (
                <h3 className="text-xl font-bold text-orange-600">
                  {infoMessage}
                </h3>
              )}
            </div>

            {/* Actions and Description */}
            <div className="flex flex-col space-y-2 text-center">
              {cartDetails &&
              cartDetails?.items.some(
                (x) => x.productId._id === id && x.size === selectedSize
              ) ? (
                <button
                  onClick={() => navigate("/cart")}
                  className="bg-black text-white py-2 rounded-lg flex justify-center items-center"
                >
                  <div className="mr-2"> Go to Cart</div>
                  <IoBagOutline />
                </button>
              ) : (
                <button
                  onClick={handleAddToBag}
                  disabled={addToCartLoading || totalStock === 0 ||CartLoading}
                  className={`bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center ${
                    totalStock === 0 && "cursor-not-allowed"
                  }`}
                >
                  <div className="mr-2"> Add to Bag</div>
                  <IoBagOutline />
                </button>
              )}
              {inWishlist ? (
                <button
                  className="bg-red-500 text-white py-2 rounded-lg  flex justify-center items-center"
                  onClick={() => toggleWishlist(product?._id)}
                  disabled={RemoveFromWishlistLoading}
                >
                  <div className="mr-2"> Remove from Wishlist </div>
                  <FaHeart className="text-white" />
                </button>
              ) : (
                <button
                  className="border border-red-500 text-red-500 py-2 rounded-lg  flex justify-center items-center"
                  onClick={() => toggleWishlist(product?._id)}
                  disabled={AddToWishlistLoading}
                >
                  <div className="mr-2"> Add to Wishlist </div>
                  <FaHeart />
                </button>
              )}

              {/* Product Description */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-left">
                  Product Description
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  {product?.description?.slice(0, 290)}...
                </p>
              </div>
            </div>
          </div>
        </div>
        <ProductCardList
          productData={relatedProducts}
          Heading={"YOU MIGHT ALSO LIKE"}
        />
      </div>
    </>
  );
};

export default ProductsDetails;
