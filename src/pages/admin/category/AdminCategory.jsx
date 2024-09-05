import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
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

const AdminCategory = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [triggerGetCategoriesList, { isLoading }] =
    useLazyGetCategoriesListQuery();
  const [createCategory] = useAddCategoryMutation();
  const [toggleCategoryIsActive] = useToggleCategoryIsActiveMutation();
  const [updateCategory, { isLoading: updateIsLoading }] =
    useUpdateCategoryMutation();

  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [toggleCategory, setToggleCategory] = useState(null);

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
        console.log(totalCategoriesCount);

        setTotalCategoriesCount(totalCategoriesCount);
      }
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
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

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
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
            <Form className="bg-white p-6 rounded shadow-md space-y-2">
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
                color="primary"
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>isActive</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories && categories.length > 0 ? (
                categories.map((category, i) => (
                  <TableRow key={category._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{category.categoryName}</TableCell>
                    <TableCell>{category.categoryDescription}</TableCell>
                    <TableCell>
                      <Switch
                        checked={category.isActive}
                        onChange={() => handleToggleClick(category)}
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
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        startIcon={<FaEdit />}
                        onClick={() => handleEditCategory(category)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5">
                    <div className="text-center text-3xl">
                      {" "}
                      Categories not found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
