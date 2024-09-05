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
import { toast } from "react-toastify";

import IsActiveToggleModal from "../../../components/common/BlockModals/IsActiveToggleModal";
import { Button } from "@mui/material";
import { FaEdit } from "react-icons/fa";

const ProductsTable = () => {
  //// api calls
  const [triggerProductList, { isLoading: productLoading }] =
    useLazyGetProductListQuery();
  const [productToggleIsActive] = useToggleProductIsActiveMutation();

  //// hooks

  const ProductList = useSelector((state) => state.products.productList);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProductsCount, setTotalProductCount] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const { totalProductsCount } = await triggerProductList({
        itemsPerPage,
        currentPage,
      }).unwrap();

      if (totalProductsCount) {
        console.log(totalProductsCount, "total");

        setTotalProductCount(totalProductsCount);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error(error.data.message ?? error);
    }
  };

  useEffect(() => {

    fetchProducts();
  }, [ currentPage]);

  const handleModalOpen = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

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
      <div className="mb-6 ml-6 text-end">
        <button
          className="bg-black text-white px-4 py-2 rounded "
          onClick={() => navigate("create-product")}
        >
          + ADD NEW PRODUCT
        </button>
      </div>
      <table className="min-w-full bg-white  border-gray-900 border border-gray-900-gray-200">
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

                <td className="px-4 py-2 border border-gray-900">
                  {item.salePrice}
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
                  <div className="flex flex-col items-center">
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
    </div>
  );
};

export default ProductsTable;
