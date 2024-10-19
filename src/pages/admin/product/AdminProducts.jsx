import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetProductListQuery,
  useToggleProductIsActiveMutation,
} from "../../../slices/admin/products/productApiSlice";
import { useSelector } from "react-redux";
import RenderPagination from "../../../components/common/Pagination/RenderPagination";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";
import { toast } from "react-hot-toast";
import CustomModal from "../../../components/common/Modals/Modal";
import IsActiveToggleModal from "../../../components/common/BlockModals/IsActiveToggleModal";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { FaEdit, FaTags } from "react-icons/fa";
import {
  useGetOffersByTypeQuery,
  useApplyOfferToProductMutation,
} from "../../../slices/admin/offers/adminOfferSlice";
import BlockModal from "../../../components/common/BlockModals/BlockModal";

const ProductsTable = () => {
  //// api calls

  const [triggerProductList, { isLoading: productLoading }] =
    useLazyGetProductListQuery();

  const { data: { offers = [] } = {}, refetch } =
    useGetOffersByTypeQuery("product");

  const [apiCallLoading, setApiCallLoading] = useState(false);

  const [productToggleIsActive] = useToggleProductIsActiveMutation();

  //// hooks

  const ProductList = useSelector((state) => state.products.productList);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [sortingOption, setSortingOption] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProductsCount, setTotalProductCount] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const { totalProductsCount } = await triggerProductList({
        itemsPerPage,
        currentPage,
        sortingOption,
      }).unwrap();

      if (totalProductsCount) {
        setTotalProductCount(totalProductsCount);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error(error.data.message ?? error);
    }
  };

  useEffect(() => {
    fetchProducts();
    refetch();
  }, [currentPage, sortingOption]);

  const handleModalOpen = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  //// handle apply offers

  const [ApplyOfferToProduct] = useApplyOfferToProductMutation();
  const [isOfferConfirmModalOpen, setIsOfferConfirmModalOpen] = useState(false);
  const [currentApplyingOffer, setCurrentApplyingOffer] = useState(null);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  const handelConfirmOfferApplying = async () => {
    try {
      setApiCallLoading(true);

      if (!currentApplyingOffer || !currentProduct) return;

      const response = await ApplyOfferToProduct({
        productId: currentProduct._id,
        offerId: currentApplyingOffer._id,
      }).unwrap();

      await refetch();
      await fetchProducts();

      toast.success(response?.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error(err);
    } finally {
      // Close modals regardless of success or failure
      setApiCallLoading(false);
      setIsOfferConfirmModalOpen(false); // Close confirmation modal
      handleOffersCloseModal(); // Close offers selection modal
      // Reset loading state
    }
  };

  const handleOffersOpenModal = (product) => {
    setCurrentProduct(product);
    setIsOffersModalOpen(true);
  };

  const handleOffersCloseModal = () => {
    setIsOffersModalOpen(false);
    setCurrentProduct(null);
  };

  ////sorting handling

  const SORT_OPTIONS = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "aA-zZ",
    "zZ-aA",
  ];

  //// handle block products
  const handleConfirmBlock = async () => {
    if (!currentProduct) {
      return;
    }
    try {
      const response = await productToggleIsActive({
        productId: currentProduct._id,
      }).unwrap();

      await fetchProducts();
    } catch (err) {
      // Display error message in case of failure

      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  //// ------------------------------------component----------------------------------------------------------

  if (productLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4  bg-gray-200">
      <AdminBreadCrumbs />
      <h1 className="text-2xl font-bold mb-4">ALL PRODUCTS</h1>
      <div className="mb-6 ml-6 flex justify-between">
        <select
          value={sortingOption}
          onChange={(e) => setSortingOption(e.target.value)}
          className=" border border-black bg-gray-300 py-2 px-4 rounded-md"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="bg-black text-white px-4 py-2 rounded "
          onClick={() => navigate("create-product")}
        >
          + ADD NEW PRODUCT
        </button>
      </div>
      <table className="min-w-full bg-white  border-gray-900 border ">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-900">Sl.No</th>
            <th className="px-4 py-2 border border-gray-900">Product Name</th>
            <th className="px-4 py-2 border border-gray-900">Brand</th>
            <th className="px-4 py-2 border border-gray-900">Category</th>
            <th className="px-4 py-2 border border-gray-900">Product Image</th>
            <th className="px-4 py-2 border border-gray-900">Price</th>
            <th className="px-4 py-2 border border-gray-900">Size:Stock </th>
            <th className="px-4 py-2 border border-gray-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {ProductList.length > 0 ? (
            ProductList.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-900">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-900">
                  {item.productName}
                </td>
                <td className="px-4 py-2 border border-gray-900">
                  {item.brand?.brandName}
                </td>
                <td className="px-4 py-2 border border-gray-900">
                  {item.category?.categoryName}
                </td>
                <td className="px-2 py-2 border border-gray-900 text-center">
                  <div className="flex justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-32 object-contain"
                    />
                  </div>
                </td>

                <td className="px-4 py-2 border border-gray-900 text-center">
                  {item.offer ? (
                    <div className="flex flex-col items-center md:mx-3">
                      {/* Check if the offer is currently active */}
                      {new Date(item.offer.startDate) <= new Date() &&
                      new Date(item.offer.endDate) >= new Date() ? (
                        <>
                          <span className="text-lg font-semibold text-gray-800">
                            ₹{item.offerPrice}
                          </span>
                          <span className="text-base text-red-500 font-medium line-through">
                            (₹{item.salePrice})
                          </span>
                          <span className="text-sm text-green-600 font-bold">
                            {item.offer?.discountPercentage}% OFF
                            {item.offer?.offerType === "category" &&
                              ` by ${item.offer?.offerType} offer`}
                          </span>
                        </>
                      ) : new Date(item.offer.startDate) > new Date() ? (
                        // Upcoming offer
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-gray-800">
                            ₹{item.salePrice}
                          </span>
                          <span className="text-sm text-yellow-600 font-medium">
                            {item.offer?.discountPercentage}% OFF -{" "}
                            {item.offer?.offerType && `${item.offer.offerType}`}{" "}
                            Offer will start on{" "}
                            {new Date(
                              item.offer.startDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        // Expired offer
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-gray-800">
                            ₹{item.salePrice}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            The offer has expired.
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-gray-800">
                      ₹{item.salePrice}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 border border-gray-900">
                  {item.stock.map((stockItem, index) => (
                    <div
                      key={index}
                      className="  mb-1 text-center  flex   items-center justify-start"
                    >
                      <div className="bg-black text-white rounded p-1 mx-2">
                        {" "}
                        {stockItem.size}{" "}
                      </div>{" "}
                      : {stockItem.stock}
                    </div>
                  ))}
                </td>

                <td className="px-4 py-2 border h-full border-gray-900">
                  <div className="flex flex-col items-center space-y-1">
                    <Button
                      variant="text"
                      color="secondary"
                      startIcon={<FaTags />}
                      onClick={() => handleOffersOpenModal(item)}
                    >
                      ApplyOffer
                    </Button>

                    <button
                      onClick={() => handleModalOpen(item)}
                      className={`px-4 py-1 rounded-md mb-3 ${
                        item.isActive ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {item.isActive ? "Active" : "InActive"}
                    </button>
                    <Button
                      variant="text"
                      color="primary"
                      startIcon={<FaEdit />}
                      onClick={() => {
                        navigate(`edit-product?id=${item._id}`);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">
                <div className="text-3xl m-5 text-center">
                  {" "}
                  Products not found
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalProductsCount}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* InActive/Active Modal */}
      <IsActiveToggleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBlock}
        message={`Are you sure you want to ${
          currentProduct?.isActive ? "InActive" : "Active"
        } this brand - ${currentProduct?.productName}?`}
        buttonName={currentProduct?.isActive ? "InActive" : "Active"}
      />

      {/* Custom Modal Component for applying offers */}
      <CustomModal
        isOpen={isOffersModalOpen}
        onClose={handleOffersCloseModal}
        title={`Select an Offer for - ${currentProduct?.productName}`}
        footer={
          <Button
            variant="contained"
            color="primary"
            onClick={handleOffersCloseModal}
          >
            Close
          </Button>
        }
        className="bg-white" // Use 'className' for styling
      >
        {/* Modal Body - Display Offers */}
        <div className="max-h-64 overflow-y-auto">
          <List className="space-y-2">
            {offers.length > 0 ? (
              offers.filter(existingOffer=> existingOffer && new Date(existingOffer.endDate) >= new Date()).map((offer) => (
                <ListItem
                  key={offer._id}
                  onClick={() => {
                    setCurrentApplyingOffer(offer);
                    setIsOfferConfirmModalOpen(true);
                  }}
                  className="hover:bg-blue-100 hover:shadow-md hover:cursor-pointer transition-all rounded-md mb-1 p-2 border border-gray-200 flex items-center space-x-4"
                >
                  {/* Icon for Each Offer */}
                  <ListItemIcon className="min-w-0">
                    <FaTags className="text-red-500 text-lg" />
                  </ListItemIcon>

                  {/* Offer Details */}
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        component="span"
                        className="font-semibold"
                      >
                        {offer.offerTitle}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          component="span"
                          className="text-gray-600 block"
                        >
                          {offer.description}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          component="span"
                          className="font-bold text-red-500 mt-1 block"
                        >
                          {offer.discountPercentage}% OFF
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body1"
                className="text-gray-600 text-center p-4"
              >
                No Offers Available
              </Typography>
            )}
          </List>
        </div>
      </CustomModal>

      <BlockModal
        open={isOfferConfirmModalOpen}
        onClose={() => setIsOfferConfirmModalOpen(false)}
        onConfirm={handelConfirmOfferApplying}
        message={`Are you sure you want to apply  this  offer - ${currentApplyingOffer?.offerTitle} ? ,after this you can not edit this  offer on product !`}
        buttonName="Apply"
        loading={apiCallLoading}
      />
    </div>
  );
};

export default ProductsTable;
