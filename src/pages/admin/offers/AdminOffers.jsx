import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
 
} from "@mui/material";

import { OfferSchema } from "../../../utils/validation/validate";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import {
  useCreateOfferMutation,
  useGetOffersByTypeQuery,
  useDeleteOfferMutation,
} from "../../../slices/admin/offers/adminOfferSlice";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen.jsx";
import toast from "react-hot-toast";
import BlockModal from "../../../components/common/BlockModals/BlockModal.jsx";

const OfferManagement = () => {
  const [apiAddOffers] = useCreateOfferMutation();
  const [apiDeleteOffers] = useDeleteOfferMutation();
  const {
    data: { offers = [] } = {},
    isLoading,
    refetch,
  } = useGetOffersByTypeQuery();

  useEffect(() => {
    if (offers?.length) {
      // Separate offers by type
      setProductOffers(offers.filter((offer) => offer.offerType === "product"));
      setCategoryOffers(
        offers.filter((offer) => offer.offerType === "category")
      );
    } else {
      setProductOffers([]);
      setCategoryOffers([]);
    }
  }, [offers, refetch]);

  const [productOffers, setProductOffers] = useState([]);
  const [categoryOffers, setCategoryOffers] = useState([]);
  const [apiCallLoading, setApiCallLoading] = useState(false);

  const [currentOfferIdToDelete, setCurrentOfferIdToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    //Function to confirm delete a new offer
    try {
      if (currentOfferIdToDelete) {
        // Toggle the isActive status
        setApiCallLoading(true);
        const response = await apiDeleteOffers(currentOfferIdToDelete).unwrap();

        await refetch();
        toast.success(response.message);
      
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err?.data?.message || err.error);
    } finally {
      setIsModalOpen(false);
      
       setApiCallLoading(false);

     
    }
  };

  // Function to handle adding a new offer
  const handleAddOffer = async (values, { resetForm }) => {
    console.log("Form Submitted Values: ", values); // Debug form values

    try {
      setApiCallLoading(true);

      const response = await apiAddOffers({
        offerTitle: values.title,
        offerDescription: values.description,
        discountPercentage: values.discountPercentage,
        offerType: values.type,
        startDate: values.startDate,
        endDate: values.endDate,
      }).unwrap();

      await refetch();

      resetForm();
      toast.success(response?.message);
    } catch (err) {
      toast.success(err?.data?.message || err.error);
      console.error(err);
    } finally {
      setApiCallLoading(false);
    }
  };

  const headers = [
    "Title",
    "Description",
    "Discount (%)",
    "Start Date",
    "End Date",
    "Actions",
  ];

  // Map offers to rows for both product and category type offers
  const productRows = productOffers.map((offer) => {
    
    const isExpired = new Date(offer.endDate) < new Date(); // Check if the end date is in the past

    const OfferApplied = offer.appliedProducts.length;

    return [
      offer.offerTitle,
      offer.offerDescription,
      `${offer.discountPercentage}%`,
      new Date(offer.startDate).toLocaleDateString(),
      <div className="flex flex-col-reverse">
        {new Date(offer.endDate).toLocaleDateString()}
        {isExpired ? (
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
        ):(OfferApplied&&<span
          style={{
            color: "green",
            marginLeft: "8px",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          (OfferApplied)
        </span>)}
      </div>,
      <Button
        key={`delete-product-${offer._id}`}
        variant="outlined"
        color="error"
        onClick={() => {
          setCurrentOfferIdToDelete(offer._id);
          setIsModalOpen(true);
        }}
      >
        Delete
      </Button>,
    ];
  });

  const categoryRows = categoryOffers.map((offer) => {

    const isExpired = new Date(offer.endDate) < new Date(); // Check if the end date is in the past
    const OfferApplied = offer.appliedCategories.length;

    return [
      offer.offerTitle,
      offer.offerDescription,
      `${offer.discountPercentage}%`,
      new Date(offer.startDate).toLocaleDateString(),
      <div className="flex flex-col-reverse">
      {new Date(offer.endDate).toLocaleDateString()}
      {isExpired ? (
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
      ):(OfferApplied&&<span
        style={{
          color: "green",
          marginLeft: "8px",
          fontSize: "0.8rem",
          fontWeight: "bold",
        }}
      >
        (OfferApplied)
      </span>)}
    </div>,
      <Button
        key={`delete-product-${offer._id}`}
        variant="outlined"
        color="error"
        onClick={() => {
          setCurrentOfferIdToDelete(offer._id);
          setIsModalOpen(true);
        }}
      >
        Delete
      </Button>,
    ];
  });
  ////-------------------------------------render component---------------------
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4 bg-gray-200">
      <AdminBreadCrumbs />
      <h1 className="text-4xl font-bold mb-4">Offers Management</h1>

      {/* Add Offer Form */}
      <div className="mb-8 bg-white p-4">
        <Formik
          initialValues={{
            title: "",
            description: "",
            discountPercentage: "",
            type: "",
            startDate: "",
            endDate: "",
          }}
          validationSchema={OfferSchema}
          onSubmit={handleAddOffer}
        >
          {({ errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Title, Description, Discount Percentage */}
                <Grid item xs={4}>
                  <Field
                    name="title"
                    as={TextField}
                    fullWidth
                    label="Offer Title"
                    variant="outlined"
                    helperText={<ErrorMessage name="title" />}
                    error={touched.title && !!errors.title}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name="description"
                    as={TextField}
                    fullWidth
                    label="Description"
                    variant="outlined"
                    helperText={<ErrorMessage name="description" />}
                    error={touched.description && !!errors.description}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name="discountPercentage"
                    as={TextField}
                    type="number"
                    fullWidth
                    label="Discount %"
                    variant="outlined"
                    helperText={<ErrorMessage name="discountPercentage" />}
                    error={
                      touched.discountPercentage && !!errors.discountPercentage
                    }
                  />
                </Grid>

                {/* Type, Start Date, End Date */}
                <Grid item xs={4}>
                  <Field
                    name="type"
                    as={TextField}
                    select
                    fullWidth
                    label="Offer Type"
                    variant="outlined"
                    helperText={<ErrorMessage name="type" />}
                    error={touched.type && !!errors.type}
                  >
                    <MenuItem value="product">Product</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name="startDate"
                    as={TextField}
                    type="date"
                    fullWidth
                    label="Start Date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("endDate", ""); // Clear end date when start date changes
                    }}
                    helperText={<ErrorMessage name="startDate" />}
                    error={touched.startDate && !!errors.startDate}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name="endDate"
                    as={TextField}
                    type="date"
                    fullWidth
                    label="End Date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="endDate" />}
                    error={touched.endDate && !!errors.endDate}
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
                      Add Offer
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
        className="font-extrabold text-center text-gray-600"
        gutterBottom
      >
        Product Offers
      </Typography>
      <ReusableTable headers={headers} rows={productRows} />
      <Typography
        variant="h4"
        className="font-bold text-center text-gray-600  "
        gutterBottom
      >
        Category Offers
      </Typography>
      <ReusableTable headers={headers} rows={categoryRows} />

      <BlockModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this offer ?`}
        buttonName="Delete"
        loading={apiCallLoading}
      />
    </div>
  );
};

export default OfferManagement;
