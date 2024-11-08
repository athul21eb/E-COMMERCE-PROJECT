import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Paper, Typography, Box, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";

import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import RenderPagination from "../../../components/common/Pagination/RenderPagination";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import { useTheme } from "../../../contexts/themeContext";
import {
  useLazyGetAllReturnOrdersQuery,
  useConfirmReturnOrderStatusMutation,
} from "../../../slices/admin/returnOrders/returnOrderApliSlice";
import Modal from "../../../components/common/Modals/Modal";
import toast from "react-hot-toast";

const AdminReturnOrders = () => {
  const navigate = useNavigate();
  const { themeStyles, theme } = useTheme();
  const [fetchReturnOrders, { isLoading, currentData, isFetching }] =
    useLazyGetAllReturnOrdersQuery();
  const [approveReturnOrder, { isLoading: isLoadingConfirmStatus }] =
    useConfirmReturnOrderStatusMutation();
  const [returnOrders, setReturnOrders] = useState(currentData?.orders ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReturnOrdersCount, setTotalReturnOrdersCount] = useState(
    currentData?.totalOrders ?? 1
  );
  const itemsPerPage = 4;

  const fetchReturnOrdersData = async () => {
    try {
      const { orders, totalOrders } = await fetchReturnOrders({
        page: currentPage,
        limit: itemsPerPage,
      }).unwrap();
      setTotalReturnOrdersCount(totalOrders);
      setReturnOrders(orders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReturnOrdersData();
  }, [currentPage]);
  console.log(returnOrders);

  ////approve function

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [itemId, setItemId] = useState(null);

  const closeModal = () => {
    setOrderId(null);
    setItemId(null);
    setIsModalOpen(false);
  };

  const handleApprove = async () => {
    try {
      if (!orderId || !itemId) {
        return;
      }
      const res = await approveReturnOrder({
        orderId,
        itemId,
        status: "approved",
      }).unwrap();

      await fetchReturnOrdersData();

      toast.success(res?.message);
    } catch (err) {
      toast.success(err?.data?.message || err.error);
      console.error(err);
    } finally {
      setOrderId(null);
      setItemId(null);
      setIsModalOpen(false);
    }
  };

  ////---------------------------------render component ----------------------------------------------------------

  if (isLoading || isFetching) {
    return <LoadingScreen />;
  }

  const headers = [
    "Return Order ID",
    "Product",
    "User",
    "Reason",
    "Remarks",

    "Action",
  ];

  const rows = returnOrders?.map((returnOrder) => [
    returnOrder?.orderId?.orderId,
    <Box display="flex" alignItems="center">
      <Avatar
        src={returnOrder?.productId?.thumbnail}
        alt={returnOrder?.productId?.productName}
        sx={{ width: 40, height: 40, marginRight: 1 }}
      />
      <Typography variant="body2" sx={{ color: themeStyles?.accent }}>
        {returnOrder?.productId?.productName}
      </Typography>
    </Box>,
    <Typography variant="body2" sx={{ color: themeStyles?.textPrimary }}>
      {returnOrder?.userId?.firstName} ({returnOrder?.userId?.email})
    </Typography>,
    <Typography variant="body2" sx={{ color: themeStyles?.textSecondary }}>
      {returnOrder?.reason}
    </Typography>,
    <Typography variant="body2" sx={{ color: themeStyles?.textSecondary }}>
      {returnOrder?.remarks || "N/A"}
    </Typography>,
    returnOrder?.status === "requested" ? (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOrderId(returnOrder?.orderId?._id);
          setItemId(returnOrder?.itemId);
          setIsModalOpen(true);
        }}
      >
        Approve
      </Button>
    ) : (
      <Typography
        variant="body2"
        sx={{
          color: returnOrder?.status === "approved" ? "green" : "red",
        }}
      >
        {returnOrder?.status.toUpperCase()}
      </Typography>
    ),
  ]);

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: themeStyles.background,
        minHeight: "100vh",
      }}
    >
      <AdminBreadCrumbs />
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "1rem",
          color: themeStyles.textPrimary,
        }}
      >
        Return Order Management
      </Typography>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: themeStyles.surface,
          color: themeStyles.textPrimary,
          marginBottom: "1rem",
        }}
      >
        <ReusableTable headers={headers} rows={rows} />
      </Paper>
      {returnOrders && returnOrders.length > 0 && (
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalReturnOrdersCount}
          itemsPerPage={itemsPerPage}
        />
      )}
      {/* //// approve the return order  item Modal  */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => (isLoadingReturnItem ? () => {} : closeReturnModal())}
        title="Cancel Item"
        footer={
          <>
            <Button
              disabled={isLoadingConfirmStatus}
              variant="outlined"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoadingConfirmStatus}
              variant="contained"
              color={"info"}
              onClick={handleApprove}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to <strong>Approve </strong> this return of this
          item ?
        </p>
      </Modal>
    </div>
  );
};

export default AdminReturnOrders;
