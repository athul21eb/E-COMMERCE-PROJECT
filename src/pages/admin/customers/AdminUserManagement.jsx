import React, { useState, useEffect } from "react";
import { FiFilter } from "react-icons/fi";

import {
  useLazyGetCustomersListQuery,
  useUpdateCustomerIsBlockedMutation,
} from "../../../slices/admin/customers/customersApiSlice.js";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import BlockModal from "../../../components/common/BlockModals/BlockModal.jsx"; // Assuming the modal is located in this path
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen.jsx";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs.jsx";
import RenderPagination from "../../../components/common/Pagination/RenderPagination.jsx";

const AdminUserManagement = () => {
  const [triggerGetCustomersList, { isLoading, error }] =
    useLazyGetCustomersListQuery();
  const [updateIsBlock, { isError }] = useUpdateCustomerIsBlockedMutation();
  const customers = useSelector((state) => state.customers.customersList);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);


  ////pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomersCount, setTotalCustomersCount] = useState(1);
  const itemsPerPage =10;
  
  const fetchCustomersData = async () => {
    try {
      const { totalCustomersCount } = await triggerGetCustomersList({
        currentPage,
        itemsPerPage,
      }).unwrap();
      if (totalCustomersCount) {
        console.log(totalCustomersCount);
  
        setTotalCustomersCount(totalCustomersCount);
      }
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchCustomersData();
  }, [currentPage]);

  const handleBlockClick = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true); // Open the modal
  };

  const handleConfirmBlock = async () => {
    try {
      if (currentCustomer) {
        // Toggle the isActive status
        const response = await updateIsBlock({ customerId: currentCustomer._id }).unwrap();
        // Refetch the customer list after updating
        await fetchCustomersData();
        toast.success(response.message || "Customer status updated successfully!");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
        err.error ||
        "An error occurred while updating customer status"
      );
    } finally {
      setIsModalOpen(false); // Close the modal
    }
  };

  if (isLoading) {
    return <LoadingScreen/>;
  }

  if (error || isError) {
    return (
      <h3 className="text-3xl">
        {error?.data?.message || isError?.data?.message || "An error occurred"}
      </h3>
    );
  }

  return (
    <div className="p-4 bg-gray-200">
     <AdminBreadCrumbs />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        {/* <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="p-2 pl-10 pr-4 border border-gray-300 rounded-md w-72"
          />
          <FiFilter className="absolute top-3 left-3 text-gray-400" />
        </div> */}
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr key={"heading"}>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Phone Number
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Created
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {customers && customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id} className="border-t">
                <td className="px-4 py-2 flex items-center">
                 
                    <div className="flex items-center">
                    <img
                      src={customer.photo ||""} // Set the image source or fallback
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    
                  </div>
                 
                  <div>
                    <p className="font-medium text-gray-900">{customer.firstName}</p>
                    <p className="text-gray-500">{customer.email}</p>
                  </div>
                </td>
                <td className="px-4 py-2">{customer.mobile_no}</td>
                <td className="px-4 py-2">
                  {new Date(customer.timestamps?.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 ">
                  <button
                    onClick={() => handleBlockClick(customer)}
                    className={`px-4 py-1 rounded-md mx-auto ${
                      customer.isBlocked ? "bg-yellow-500" : "bg-green-500"
                    } text-white`}
                  >
                    {customer.isBlocked ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalCustomersCount}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Block/Unblock Modal */}
      <BlockModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBlock}
        message={`Are you sure you want to ${
          currentCustomer?.isBlocked ? "unblock" : "block"
        } this customer?`}
        buttonName={currentCustomer?.isBlocked ? "Unblock" : "Block"}
      />
    </div>
  );
};

export default AdminUserManagement;
