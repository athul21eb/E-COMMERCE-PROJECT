import React, { useState, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLazyGetCustomersListQuery, useUpdateCustomerIsBlockedMutation } from "../../../slices/admin/customers/customersApiSlice.js";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen.jsx";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs.jsx";
import RenderPagination from "../../../components/common/Pagination/RenderPagination.jsx";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable"; // Reusable table component
import BlockModal from "../../../components/common/BlockModals/BlockModal.jsx"; 
import { useTheme } from "../../../contexts/themeContext"; // Assuming you have a theme context

const AdminUserManagement = () => {
  const { themeStyles } = useTheme();
  const [triggerGetCustomersList, { isLoading, error }] = useLazyGetCustomersListQuery();
  const [updateIsBlock, { isError }] = useUpdateCustomerIsBlockedMutation();
  const customers = useSelector((state) => state.customers.customersList);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  //// Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomersCount, setTotalCustomersCount] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomersData = async () => {
    try {
      const { totalCustomersCount } = await triggerGetCustomersList({
        currentPage,
        itemsPerPage,
      }).unwrap();
      if (totalCustomersCount) {
        setTotalCustomersCount(totalCustomersCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, [currentPage]);

  const handleBlockClick = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    try {
      if (currentCustomer) {
        const response = await updateIsBlock({ customerId: currentCustomer._id }).unwrap();
        await fetchCustomersData();
        toast.success(response.message || "Customer status updated successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error || "An error occurred while updating customer status");
    } finally {
      setIsModalOpen(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || isError) {
    return (
      <h3 className="text-3xl">
        {error?.data?.message || isError?.data?.message || "An error occurred"}
      </h3>
    );
  }

  const headers = ["Name", "Phone Number", "Created", "Action"];

  const rows = customers?.map((customer) => [
    <div className="flex items-center">
      <img
        src={customer.photo || ""}
        alt="User"
        className="w-8 h-8 rounded-full object-cover mr-2"
      />
      <div>
        <p className="font-medium text-gray-400">{customer.firstName}</p>
        <p className="text-gray-500">{customer.email}</p>
      </div>
    </div>,
    customer.mobile_no,
    new Date(customer.timestamps?.createdAt).toLocaleDateString(),
    <button
      onClick={() => handleBlockClick(customer)}
      className={`px-4 py-1 rounded-md mx-auto ${customer.isBlocked ? "bg-green-500" : "bg-orange-500"} text-white`}
    >
      {customer.isBlocked ? "Unblock" : "Block"}
    </button>
  ]);

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: themeStyles.background,
        color: themeStyles.textPrimary,
      }}
    >
      <AdminBreadCrumbs />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold" style={{ color: themeStyles.textPrimary }}>
          Customers
        </h1>
      </div>

      <ReusableTable headers={headers} rows={rows} />

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
        message={`Are you sure you want to ${currentCustomer?.isBlocked ? "unblock" : "block"} this customer?`}
        buttonName={currentCustomer?.isBlocked ? "Unblock" : "Block"}
      />
    </div>
  );
};

export default AdminUserManagement;
