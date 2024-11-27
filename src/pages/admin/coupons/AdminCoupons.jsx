import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, MenuItem, Typography } from "@mui/material";
// import { useCreateCouponMutation, useGetCouponsQuery, useDeleteCouponMutation } from "../../../slices/admin/coupons/adminCouponSlice"; // Adjust the import based on your actual slice
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen.jsx";
import toast from "react-hot-toast";
import BlockModal from "../../../components/common/BlockModals/BlockModal.jsx";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import {
  useAddCouponMutation,
  useDeleteCouponMutation,
  useGetCouponsQuery,
} from "../../../slices/admin/coupons/adminCouponsApiSlice.js";
import { CouponSchema } from "../../../utils/validation/validate.js";
import { useTheme } from "../../../contexts/themeContext.jsx";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs.jsx";


const CouponManagement = () => {
  const {theme ,themeStyles} = useTheme();
  const [apiAddCoupon] = useAddCouponMutation();
  const [apiDeleteCoupon] = useDeleteCouponMutation();
  const {
    data: { coupons = [] } = {},
    isLoading,
    refetch,
  } = useGetCouponsQuery();

  const [apiCallLoading, setApiCallLoading] = useState(false);
  const [currentCouponIdToDelete, setCurrentCouponIdToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      if (currentCouponIdToDelete) {
        setApiCallLoading(true);
        const response = await apiDeleteCoupon(
          currentCouponIdToDelete
        ).unwrap();
        await refetch();
        toast.success(response.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setApiCallLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleAddCoupon = async (values, { resetForm }) => {
    try {
      setApiCallLoading(true);
      const response = await apiAddCoupon({
        code: values.code,
        discount: values.discount,
        expirationDate: values.expirationDate,
        maxDiscountAmount: values.maxDiscountAmount,
        minPurchaseAmount: values.minPurchaseAmount,
      }).unwrap();

      await refetch();
      resetForm();
      toast.success(response?.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setApiCallLoading(false);
    }
  };

  const headers = [
    "Code",
    "Discount (%)",
    "Expiration Date",
    "Max Discount Amount",
    "Min Purchase Amount",
    "Actions",
  ];

  const rows = coupons.map((coupon) => {
    const isExpired = new Date(coupon.expirationDate) < new Date();

    return [
      coupon.code,
      `${coupon.discount}%`,
      <div>
        {new Date(coupon.expirationDate).toLocaleDateString()}
        {isExpired && (
          <span
            style={{
              color: "red",
              marginLeft: "8px",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            (Expired)
          </span>
        )}
      </div>,
      ` ₹${coupon.maxDiscountAmount}`,
      ` ₹${coupon.minPurchaseAmount}`,
      <Button
        key={`delete-coupon-${coupon._id}`}
        variant="outlined"
        color="error"
        onClick={() => {
          setCurrentCouponIdToDelete(coupon._id);
          setIsModalOpen(true);
        }}
      >
        Delete
      </Button>,
    ];
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4 " style={{backgroundColor:themeStyles.backgroundColor}}>
      <AdminBreadCrumbs />
      <h1 className="text-4xl font-bold mb-4" style={{color:themeStyles.textPrimary}}>Coupons Management</h1>

      {/* Add Coupon Form */}
      <div className="mb-8 p-4" style={{backgroundColor:themeStyles.surface}}>
        <Formik
          initialValues={{
            code: "",
            discount: "",
            expirationDate: "",
            maxDiscountAmount: "",
            minPurchaseAmount: "",
          }}
          validationSchema={CouponSchema}
          onSubmit={handleAddCoupon}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Field
                    name="code"
                    as={TextField}
                    fullWidth
                    label="Coupon Code"
                    variant="outlined"
                    helperText={<ErrorMessage name="code" />}
                    error={touched.code && !!errors.code}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                        fontSize: "1em",
                       
                        color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                      },
                      "& .MuiInputLabel-root": {
                        color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name="discount"
                    as={TextField}
                    type="number"
                    fullWidth
                    label="Discount %"
                    variant="outlined"
                    helperText={<ErrorMessage name="discount" />}
                    error={touched.discount && !!errors.discount}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                        fontSize: "1em",
                      
                        color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                      },
                      "& .MuiInputLabel-root": {
                        color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                      fontSize: "1em",
                     
                      color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                    },
                    "& .MuiInputLabel-root": {
                      color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                      fontSize: "1rem",
                    },
                  }}
                    name="maxDiscountAmount"
                    as={TextField}
                    type="number"
                    fullWidth
                    label="Max Discount Amount"
                    variant="outlined"
                    helperText={<ErrorMessage name="maxDiscountAmount" />}
                    error={
                      touched.maxDiscountAmount && !!errors.maxDiscountAmount
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                      fontSize: "1em",
                     
                      color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                    },
                    "& .MuiInputLabel-root": {
                      color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                      fontSize: "1rem",
                    },
                  }}
                    name="minPurchaseAmount"
                    as={TextField}
                    type="number"
                    fullWidth
                    label="Min Purchase Amount"
                    variant="outlined"
                    helperText={<ErrorMessage name="minPurchaseAmount" />}
                    error={
                      touched.minPurchaseAmount && !!errors.minPurchaseAmount
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                      fontSize: "1em",
                     
                      color: theme === "light" ? "#333333" : "#ffffff", // Dynamic text color
                    },
                    "& .MuiInputLabel-root": {
                      color: theme === "light" ? "#333333" : "#cccccc", // Dynamic label color
                      fontSize: "1rem",
                    },
                  }}
                    name="expirationDate"
                    as={TextField}
                    type="date"
                    fullWidth
                    label="Expiration Date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="expirationDate" />}
                    error={touched.expirationDate && !!errors.expirationDate}
                  />
                </Grid>
                <Grid item xs={12}>
                  {apiCallLoading ? (
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      className="mt-2"
                      size="small"
                      disabled
                    >
                      Please wait...
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      Add Coupon
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>

      <Typography
        variant="h4"
        className="font-bold text-center text-gray-600  "
        gutterBottom
        style={{color:themeStyles.textPrimary}}
      >
        Coupons List
      </Typography>
      <ReusableTable headers={headers} rows={rows} />

      <BlockModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this coupon?`}
        buttonName="Delete"
        loading={apiCallLoading}
      />
    </div>
  );
};

export default CouponManagement;
