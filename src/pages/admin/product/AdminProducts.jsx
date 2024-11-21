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
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import { useTheme } from "../../../contexts/themeContext";

const ProductsTable = () => {
  //// api calls

  const [triggerProductList, { isLoading: productLoading }] =
    useLazyGetProductListQuery();

  const {
    data: { offers = [] } = {},
    isLoading,
    isError,
    refetch,
  } = useGetOffersByTypeQuery("product");

  const [apiCallLoading, setApiCallLoading] = useState(false);

  const [productToggleIsActive] = useToggleProductIsActiveMutation();
  const { themeStyles,theme } = useTheme();
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

  const headers = [
    "Sl.No",
    "Product Name",
    "Brand",
    "Category",
    "Product Image",
    "Price",
    "Size:Stock",
    "Action",
  ];
  const rows = ProductList.map((item, index) => [
    // Sl.No
    (currentPage - 1) * itemsPerPage + index + 1,

    // Product Name
    item.productName,

    // Brand
    item.brand?.brandName,

    // Category
    item.category?.categoryName,

    // Product Image
    <div className="flex justify-center">
      <img
        src={item.thumbnail}
        alt={item.productName}
        className="w-32 object-contain"
      />
    </div>,
    // Price
    item.offer ? (
      <div className="flex flex-col items-center md:mx-3">
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
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              ₹{item.salePrice}
            </span>
            <span className="text-sm text-yellow-600 font-medium">
              {item.offer?.discountPercentage}% OFF -{" "}
              {item.offer?.offerType && `${item.offer.offerType}`} Offer will
              start on {new Date(item.offer.startDate).toLocaleDateString()}
            </span>
          </div>
        ) : (
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
    ),

    // Size:Stock
    item.stock.map((stockItem, i) => (
      <div key={i} className="mb-1 text-center flex items-center justify-start">
        <div className="bg-black text-white rounded p-1 mx-2">
          {stockItem.size}
        </div>
        : {stockItem.stock}
      </div>
    )),

    // Action
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
    </div>,
  ]);

  //// ------------------------------------component----------------------------------------------------------

  if (productLoading) {
    return <LoadingScreen />;
  }

  return (
    <div  style={{ 
      padding: "1rem", 
      backgroundColor: themeStyles.background,
      minHeight: "100vh"
    }}>
      <AdminBreadCrumbs />
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: "bold", 
          marginBottom: "1rem",
          color: themeStyles.textPrimary
        }}
      >
        Products Management
      </Typography>
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
   
      <ReusableTable headers={headers} rows={rows} />
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
        Classnames="h-full"
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
        <div className="max-h-64 min-h-10 overflow-y-auto">
          {isLoading ? (
            <Typography
              variant="body1"
              className="text-gray-600 text-center p-4"
            >
              Loading offers...
            </Typography>
          ) : isError ? (
            <Typography
              variant="body1"
              className="text-red-600 text-center p-4"
            >
              Failed to fetch offers. Please try again later.
            </Typography>
          ) : offers.filter(
              (existingOffer) =>
                existingOffer && new Date(existingOffer.endDate) >= new Date()
            ).length > 0 ? (
            <List className="space-y-2">
              {offers
                .filter(
                  (existingOffer) =>
                    existingOffer &&
                    new Date(existingOffer.endDate) >= new Date()
                )
                .map((offer) => (
                  <ListItem
                    key={offer._id}
                    onClick={() => {
                      setCurrentApplyingOffer(offer);
                      setIsOfferConfirmModalOpen(true);
                    }}
                    className="hover:bg-blue-100 hover:shadow-md hover:cursor-pointer transition-all rounded-md mb-1 p-2 border border-gray-200 flex items-center space-x-4"
                  >
                    <ListItemIcon className="min-w-0">
                      <FaTags className="text-red-500 text-lg" />
                    </ListItemIcon>
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
                        <>
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
                        </>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              className="text-gray-600 text-center p-4"
            >
              No Offers Available
            </Typography>
          )}
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
