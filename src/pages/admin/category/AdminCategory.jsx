import React, { useEffect, useState } from "react";
import { FaEdit, FaTags } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";

import IsActiveToggleModal from "../../../components/common/BlockModals/IsActiveToggleModal.jsx";

import {
  TextField,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  useAddCategoryMutation,
  useLazyGetCategoriesListQuery,
  useToggleCategoryIsActiveMutation,
  useUpdateCategoryMutation,
} from "../../../slices/admin/category/categoryApiSlice";
import { useSelector } from "react-redux";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";
import { toast } from "react-toastify";
import Modal from "../../../components/common/Modals/Modal";
import { CategoryValidationSchema } from "../../../utils/validation/validate";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import RenderPagination from "../../../components/common/Pagination/RenderPagination.jsx";
import BlockModal from "../../../components/common/BlockModals/BlockModal.jsx";
import CustomModal from "../../../components/common/Modals/Modal";
import {
  useApplyOfferToCategoryMutation,
  useGetOffersByTypeQuery,
} from "../../../slices/admin/offers/adminOfferSlice.js";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable.jsx";
import { useTheme } from "../../../contexts/themeContext.jsx";


const AdminCategory = () => {

  const {themeStyles,theme} = useTheme()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [toggleCategory, setToggleCategory] = useState(null);

  const [apiCallLoading, setApiCallLoading] = useState(false);

  ////api calls
  const [triggerGetCategoriesList, { isLoading }] =
    useLazyGetCategoriesListQuery();
  const [createCategory] = useAddCategoryMutation();
  const [toggleCategoryIsActive] = useToggleCategoryIsActiveMutation();
  const [updateCategory, { isLoading: updateIsLoading }] =
    useUpdateCategoryMutation();

  const { data: { offers = [] } = {}, refetch } =
    useGetOffersByTypeQuery("category");

  ////pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(1);
  const itemsPerPage = 10;

  const fetchCategoriesData = async () => {
    try {
      const { totalCategoriesCount } = await triggerGetCategoriesList({
        currentPage,
        itemsPerPage,
      }).unwrap();
      if (totalCategoriesCount) {
        setTotalCategoriesCount(totalCategoriesCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
    refetch();
  }, [currentPage]);

  

  const handleToggleClick = (category) => {
    setToggleCategory(category);
    setIsToggleModalOpen(true);
  };

  const categories = useSelector((state) => state.categories.categoriesList);

  const handleAddCategory = async (values, { resetForm }) => {
    try {
      const response = await createCategory(values).unwrap();
      toast.success(response.message);
      await fetchCategoriesData();

      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "An error occurred");
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (values) => {
    try {
      const response = await updateCategory({
        id: selectedCategory._id,

        ...values,
      }).unwrap();
      toast.success(response.message);
      await fetchCategoriesData();

      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "An error occurred");
    }
  };

  const confirmToggleModal = async () => {
    if (!toggleCategory) {
      return;
    }
    try {
      const response = await toggleCategoryIsActive({
        categoryId: toggleCategory._id,
      }).unwrap();
      await fetchCategoriesData();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "An error occurred");
    } finally {
      setIsToggleModalOpen(false);
    }
  };
  //// handle apply offers

  const [ApplyOfferToCategory] = useApplyOfferToCategoryMutation();
  const [isOfferConfirmModalOpen, setIsOfferConfirmModalOpen] = useState(false);
  const [currentApplyingOffer, setCurrentApplyingOffer] = useState(null);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  const handelConfirmOfferApplying = async () => {
    try {
      setApiCallLoading(true);

      if (!currentApplyingOffer || !selectedCategory) return;

      const response = await ApplyOfferToCategory({
        categoryId: selectedCategory._id,
        offerId: currentApplyingOffer._id,
      }).unwrap();

      await refetch();
      await fetchCategoriesData();

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

  const handleOffersOpenModal = (category) => {
    setSelectedCategory(category);
    setIsOffersModalOpen(true);
  };

  const handleOffersCloseModal = () => {
    setIsOffersModalOpen(false);
    setSelectedCategory(null);
  };

  const headers = ["No", "Category Name", "Description", "isActive","Actions"];

  const rows = categories && categories.length > 0 ?(categories.map((category, index) => ([
     index + 1,
    category.categoryName,
    category.categoryDescription,
     
      <Switch
        checked={category.isActive}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "green",
            "&:hover": {
              backgroundColor: "rgba(0, 128, 0, 0.1)",
            },
          },
          "& .MuiSwitch-switchBase": {
            color: "red",
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            },
          },
          "& .MuiSwitch-track": {
            backgroundColor: category.isActive
              ? "green"
              : "red",
          },
        }}
        onChange={() => handleToggleClick(category)}
      />
    , <>
    <Button
      variant="text"
      color="secondary"
      startIcon={<FaTags />}
      onClick={() => handleOffersOpenModal(category)}
    >
      Apply Offer
    </Button>
    <Button
      variant="text"
      color="primary"
      startIcon={<FaEdit />}
      onClick={() => handleEditCategory(category)}
    >
      Update
    </Button>
  </>
  ]))):[];
  /////----------------------------------------------render component--------------------------------
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="p-4  min-h-screen"
    style={{
      backgroundColor: themeStyles.background,
      color: themeStyles.textPrimary,
    }}
    >
      <AdminBreadCrumbs />
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Category</h2>
        <Formik
          initialValues={{ categoryName: "", categoryDescription: "" }}
          validationSchema={CategoryValidationSchema}
          onSubmit={handleAddCategory}
        >
          {({ errors, touched }) => (
             <Form
             className={`p-6 rounded shadow-md space-y-2 ${theme === 'light'?"bg-white":"bg-[#1e1e2f]"}`}
             sx={{
               borderRadius: '8px', // Added styling for rounded corners
               boxShadow: 3, // Example shadow, you can adjust as needed
               padding: '1.5rem', // Padding for the form
               backgroundColor: theme === 'light' ? '#fff' : '#333', // Light or dark background
               color: theme === 'light' ? '#000' : '#fff', // Text color
             }}
           >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <Field
                 as={TextField}
                 name="categoryName"
                 
                 placeholder="Category"
                 label="Category Name"
                 variant="outlined"
                 fullWidth
                 error={touched.categoryName && Boolean(errors.categoryName)}
                 helperText={<ErrorMessage name="categoryName" />}
               />
               <Field
                 as={TextField}
                 name="categoryDescription"
                 placeholder="Description"
                 label="Description"
                 variant="outlined"
                 fullWidth
                 multiline
                 maxRows={8}
                 error={touched.categoryDescription && Boolean(errors.categoryDescription)}
                 helperText={<ErrorMessage name="categoryDescription" />}
               />
             </div>
             <Button
               type="submit"
               variant="contained"
               sx={{
                 backgroundColor: theme === 'light' ? '#1976d2' : '#90caf9', // Button color for light/dark mode
                 color: theme === 'light' ? '#fff' : '#000', // Text color of the button
                 '&:hover': {
                   backgroundColor: theme === 'light' ? '#1565c0' : '#64b5f6', // Hover effect for button
                 },
               }}
               className="mt-4"
             >
               Add Category
             </Button>
           </Form>
          )}
        </Formik>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Category List</h2>
        <ReusableTable headers={headers} rows={rows}/>
      
      </div>
      <div>
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalCategoriesCount}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Edit Category Modal */}
      {selectedCategory && (
        <Modal
          
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Category"
          footer={
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsEditModalOpen(false)}
            >
              Close
            </Button>
          }
        >
          <Formik
            initialValues={{
              categoryId: selectedCategory._id || "",
              categoryName: selectedCategory.categoryName || "",
              categoryDescription: selectedCategory.categoryDescription || "",
            }}
            validationSchema={CategoryValidationSchema}
            onSubmit={handleUpdateCategory}
          >
            {({ errors, touched }) => (
              <Form className="bg-white p-6 rounded shadow-md space-y-4">
                {/* Hidden Field for Category ID */}
                <Field type="hidden" name="categoryId" />

                <div className="grid grid-cols-1  gap-4">
                  <Field
                    as={TextField}
                    name="categoryName"
                    placeholder="Category"
                    label="Category Name"
                    variant="outlined"
                    fullWidth
                    error={touched.categoryName && Boolean(errors.categoryName)}
                    helperText={<ErrorMessage name="categoryName" />}
                  />
                  <Field
                    as={TextField}
                    name="categoryDescription"
                    placeholder="Description"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={8}
                    error={
                      touched.categoryDescription &&
                      Boolean(errors.categoryDescription)
                    }
                    helperText={<ErrorMessage name="categoryDescription" />}
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  className="mt-4"
                >
                  Update Category
                </Button>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Custom Modal Component for apply offers */}
      <CustomModal
        isOpen={isOffersModalOpen}
        onClose={handleOffersCloseModal}
        title={`Select an Offer for - ${selectedCategory?.categoryName}`}
        footer={
          <Button
            variant="contained"
            color="primary"
            onClick={handleOffersCloseModal}
          >
            Close
          </Button>
        }
        Classnames="bg-white"
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
                  {/* Icon or Tag for Each Offer */}
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
        message={`Are you sure you want to apply  this  offer - ${currentApplyingOffer?.offerTitle} ? ,after this you can not edit this  offer on category!`}
        buttonName="Apply"
        loading={apiCallLoading}
      />

      {/* InActive/Active Modal */}
      <IsActiveToggleModal
        open={isToggleModalOpen}
        onClose={() => setIsToggleModalOpen(false)}
        onConfirm={confirmToggleModal}
        message={`Are you sure you want to ${
          toggleCategory?.isActive ? "InActive" : "Active"
        } this brand - ${toggleCategory?.categoryName}?`}
        buttonName={toggleCategory?.isActive ? "InActive" : "Active"}
      />
    </div>
  );
};

export default AdminCategory;
