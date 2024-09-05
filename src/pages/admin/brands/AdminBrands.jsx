import React, { useEffect, useRef, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Switch,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  useAddBrandMutation,
  useLazyGetBrandsListQuery,
  useToggleBrandIsActiveMutation,
  useUpdateBrandMutation,
} from "../../../slices/admin/brands/brandsApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadImage } from "../../../utils/cloundinary/cloudinary";
import { TiDelete } from "react-icons/ti";
import IsActiveToggleModal from "../../../components/common/BlockModals/IsActiveToggleModal";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import ImageCropperModal from "../../../components/common/ImageCropModals/ImageCropModal";
import RenderPagination from "../../../components/common/Pagination/RenderPagination";

const BrandPage = () => {
  const scrollRef = useRef(null);

 
  const [updateBrandIsActive] = useToggleBrandIsActiveMutation();
  const [createBrand, { isLoading: createBrandLoading }] =
    useAddBrandMutation();
  const [updateBrand, { isLoading: updateBrandLoading }] =
    useUpdateBrandMutation();

  const brands = useSelector((state) => state.brands.brandsList);

  ////crop states
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  ////modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toggleBrand, setToggleBrand] = useState(null);

  ////pagination States

   // Mutations - Api Actions
   const [triggerGetBrandsList, { isLoading: brandsQueryLoading }] =
   useLazyGetBrandsListQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalBrandsCount, setTotalBrandsCount] = useState(1);
  const itemsPerPage = 5;

  const fetchBrandsData = async () => {
    try {
      const { totalBrandsCount } = await triggerGetBrandsList({
        currentPage,
        itemsPerPage,
      }).unwrap();
      if (totalBrandsCount) {
        console.log(totalBrandsCount);
        
        setTotalBrandsCount(totalBrandsCount);
      }
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrandsData();
  }, [currentPage]);
  
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);

  const handleToggleClick = (brand) => {
    setToggleBrand(brand);
    setIsModalOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Brand Name is required"),
      description: Yup.string().trim().required("Description is required"),
      photo: Yup.mixed().required("A brand photo is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!previewImage) {
          toast.error("Please upload a brand photo");
          return;
        }
        setLoadingAPI(true);

        if (editMode) {
          
         await handleEditSubmit(values, formik);
          
        } else {
          const uploadedImageUrL = await uploadImage(previewImage, "brands");
          const response = await createBrand({
            brandPhotoUrl: uploadedImageUrL,
            brandName: values.name,
            brandDescription: values.description,
          }).unwrap();
          toast.success(response.message);
          await fetchBrandsData();
          resetForm();
          setPreviewImage(null);
        }
      } catch (err) {
        toast.error(err?.data?.message || err?.error);
        console.error(err);
      } finally {
        setLoadingAPI(false);
       
      }
    },
  });

  ////crop functions

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setPreviewImage(croppedImage);
    setIsCropperOpen(false);
  };

  const handleCancelCrop = () => {
    setIsCropperOpen(false);
    setSelectedImage(null);
    formik.setFieldValue("photo", null);
  };

  // Function to scroll to the top of the form container
  const scrollToForm = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEdit = (brand) => {
    // Scroll to the form when edit is triggered
    setBrandToEdit(brand);
    setPreviewImage(brand.brandPhotoUrl);
    setEditMode(true);
    formik.setValues({
      name: brand.brandName,
      description: brand.brandDescription,
      photo: brand.brandPhotoUrl,
    });

    scrollToForm();
  };

  const handleEditSubmit = async (values, { resetForm }) => {

   
    let uploadedImageUrL = previewImage;

    // Only upload a new image if the previewImage has changed
    if (uploadedImageUrL !== brandToEdit.brandPhotoUrl) {
      uploadedImageUrL = await uploadImage(uploadedImageUrL, "brands");
    }

    // Update the brand
    const response = await updateBrand({
      brandId: brandToEdit._id,
      brandPhotoUrl: uploadedImageUrL,
      brandName: values.name,
      brandDescription: values.description,
    }).unwrap();

    // Show success message
    toast.success(response.message);

    // Reset form, preview image, and exit edit mode
    resetForm(); // Resets form fields
    setPreviewImage(null); // Clears the preview image
    setEditMode(false);
    setBrandToEdit(null); // Switches back to "add" mode

    // Optionally, scroll to the top of the form
    scrollToForm();

    // Trigger refresh of the brand list
    await fetchBrandsData();

    
  };

  const confirmIsActiveToggle = async () => {
    if (!toggleBrand) {
      return;
    }

    try {
      const response = await updateBrandIsActive({
        brandId: toggleBrand._id,
      }).unwrap();

      toast.success(response.message);
      await triggerGetBrandsList({ currentPage, itemsPerPage });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "An error occurred");
    } finally {
      setIsModalOpen(false);
    }
  };

  //// ------------------------------------component----------------------------------------------------------
  if (brandsQueryLoading) return <LoadingScreen />;

  return (
    <div className="p-4  bg-gray-200">
      <AdminBreadCrumbs />
      <h1 className="text-2xl font-bold mb-4">Brand Management</h1>

      {/* Add/Edit Brand Form */}
      <div ref={scrollRef}>
        {" "}
        {/* Attach ref here */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit(formik.values);
          }}
          className="bg-white p-4 rounded shadow-sm mb-4 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TextField
              label="Brand Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              size="small"
              fullWidth
            />

            <TextField
              multiline
              maxRows={8}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              size="small"
              fullWidth
            />

            <div className="flex flex-col items-center">
              {!previewImage ? (
                <>
                  <div
                    className="p-2 border border-gray-300 rounded-md cursor-pointer"
                    onClick={() =>
                      document.getElementById("brand-image").click()
                    }
                  >
                    <TextField
                      style={{ display: "none" }}
                      id="brand-image"
                      type="file"
                      name="photo"
                      onChange={(event) => {
                        handleImageChange(event);
                        formik.setFieldValue("photo", event.target.files[0]);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.photo && Boolean(formik.errors.photo)
                      }
                      helperText={formik.touched.photo && formik.errors.photo}
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <span className="text-gray-500 text-center block">
                      Click to upload and crop BrandImage
                    </span>
                  </div>
                  {formik.touched.photo && formik.errors.photo && (
                    <div className="text-[#e3342f] font-semibold  text-xs mt-1 ml-4 self-start">
                      {formik.errors.photo && "Photo is required"}
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-2 relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-40 object-contain rounded"
                  />
                  <TiDelete
                    className="absolute top-0 right-0 text-red-500 cursor-pointer"
                    size={24}
                    onClick={() => {
                      setPreviewImage(null);
                      formik.setFieldValue("photo", null);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {loadingAPI ? (
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
            <>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="mt-2"
                size="small"
              >
                {editMode ? "Update Brand" : "Add Brand"}
              </Button>
              {editMode && (
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    // Reset form, preview image, and exit edit mode
                    formik.resetForm(); // Resets form fields
                    setPreviewImage(null); // Clears the preview image
                    setEditMode(false);
                    setBrandToEdit(null); // Switches back to "add" mode
                  }}
                >
                  Cancel
                </Button>
              )}
            </>
          )}
        </form>
      </div>

      {/* Brand List */}
      <Paper className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Brand List</h2>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Brand Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>isActive</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <TableRow key={brand._id}>
                    <TableCell>
                      <img
                        src={brand.brandPhotoUrl}
                        alt={brand.brandName}
                        className="h-10 w-10 object-fill mx-auto"
                      />
                    </TableCell>
                    <TableCell>{brand.brandName}</TableCell>
                    <TableCell>{brand.brandDescription}</TableCell>
                    <TableCell>
                      <Switch
                        checked={brand.isActive}
                        onChange={() => handleToggleClick(brand)}
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
                            backgroundColor: brand.isActive ? "green" : "red",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(brand)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5">
                    <div className="text-center text-3xl">
                      {" "}
                      Brands not found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div>
        <RenderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProductsCount={totalBrandsCount}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* InActive/Active Modal */}
      <IsActiveToggleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmIsActiveToggle}
        message={`Are you sure you want to ${
          toggleBrand?.isActive ? "InActive" : "Active"
        } this brand - ${toggleBrand?.brandName}?`}
        buttonName={toggleBrand?.isActive ? "InActive" : "Active"}
      />
      {/* Brand Image cropper*/}
      {isCropperOpen && (
        <ImageCropperModal
          image={selectedImage}
          onCancel={handleCancelCrop}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default BrandPage;
