import React, { useEffect, useRef, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch, TextField, Button, Autocomplete } from "@mui/material";
import { TiDelete } from "react-icons/ti";
import { toast } from "react-toastify";

import { uploadImage } from "../../../utils/cloundinary/cloudinary";
import { useTheme } from "../../../contexts/themeContext";
import AdminBreadCrumbs from "../../../components/common/BreadCrumbs/AdminBreadCrumbs";
import LoadingScreen from "../../../components/common/LoadingScreens/LoadingScreen";
import ReusableTable from "../../../components/common/reUsableTable/ReUsableTable";
import RenderPagination from "../../../components/common/Pagination/RenderPagination";
import ImageCropperModal from "../../../components/common/ImageCropModals/ImageCropModal";
import IsActiveToggleModal from "../../../components/common/BlockModals/IsActiveToggleModal";

import {
  useAddBannerMutation,
  useLazyGetBannersListQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerIsActiveMutation,
  useGetOfferProductsQuery,
} from "../../../slices/admin/banners/bannersApiSlice";
import BlockModal from "../../../components/common/BlockModals/BlockModal";

const BannerPage = () => {
  const scrollRef = useRef(null);
  const { theme, themeStyles } = useTheme();

  const {
    data: { productsList = [] } = {},
    refetch,
    isLoading: offerProductsLoading,
  } = useGetOfferProductsQuery();

  // Mutations and Queries
  const [createBanner, { isLoading: createBannerLoading }] =
    useAddBannerMutation();
  const [updateBanner, { isLoading: updateBannerLoading }] =
    useUpdateBannerMutation();
  const [deleteBanner, { isLoading: deleteBannerLoading }] =
    useDeleteBannerMutation();
  const [updateBannerIsActive] = useToggleBannerIsActiveMutation();
  const [triggerGetBannersList, { isLoading: bannersQueryLoading }] =
    useLazyGetBannersListQuery();

  // State Management
  const [banners, setBanners] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBannersCount, setTotalBannersCount] = useState(1);
  const itemsPerPage = 5;

  const [loadingAPI, setLoadingAPI] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  // Image Handling States
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleBanner, setToggleBanner] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const [f] = useState([
    {
      _id: "66cc37b7cf18045ece8521c0",
      productName: "Nike Phantom Luna 2 Elite",
      name: "Nike Phantom Luna 2 Elite",
      thumbnail:
        "https://res.cloudinary.com/dmrvutjac/image/upload/v1725088890/ThumbNail/zwkyqqzsqq6fw2dojvbt.png",
    },
    {
      _id: "66cc37b7cf18045ece8521c0",
      productName: "Nike Phantom Luna 2 Elite",
      name: "Nike Phantom Luna 2 Elite",
      thumbnail:
        "https://res.cloudinary.com/dmrvutjac/image/upload/v1725088890/ThumbNail/zwkyqqzsqq6fw2dojvbt.png",
    },
    {
      _id: "66cc37b7cf18045ece8521c0",
      productName: "Nike Phantom Luna 2 Elite",
      name: "Nike Phantom Luna 2 Elite",
      thumbnail:
        "https://res.cloudinary.com/dmrvutjac/image/upload/v1725088890/ThumbNail/zwkyqqzsqq6fw2dojvbt.png",
    },
  ]);

  // Fetch Banner Data
  const fetchBannersData = async () => {
    try {
      const { totalBannersCount, banners } = await triggerGetBannersList({
        page: currentPage,
        limit: itemsPerPage,
      }).unwrap();

      if (totalBannersCount) {
        setTotalBannersCount(totalBannersCount);
      }
      if (banners) {
        setBanners(banners);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to fetch data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBannersData();
    refetch();
  }, [currentPage]);

  // Image Upload Handlers
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
    formik.setFieldValue("image", null);
  };

  // Delete Banner Handler
  const handleDelete = (banner) => {
    setBannerToDelete(banner);
    setDeleteConfirmModal(true);
  };

  const confirmDeleteBanner = async () => {
    if (!bannerToDelete) {
      toast.warning(`select a banner to delete`);
      return;
    }

    try {
      setLoadingAPI(true);
      const response = await deleteBanner({
        bannerId: bannerToDelete._id,
      }).unwrap();

      toast.success(response.message);
      await fetchBannersData();
      setDeleteConfirmModal(false);
      setBannerToDelete(null);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.data?.message[0] || "Failed to delete banner"
      );
      console.error(err);
    } finally {
      setLoadingAPI(false);
    }
  };

  // Form Handling
  const formik = useFormik({
    initialValues: {
      product: null,
      title: "",
      subTitle: "",
      image: null,
    },
    validationSchema: Yup.object({
      product: Yup.object().required("Product is required"),
      title: Yup.string()
        .trim()
        .min(5, "Title must be at least 5 characters")
        .max(50, "Title must be at most 50 characters")
        .required("Title is required"),
      subTitle: Yup.string()
        .trim()
        .min(5, "Subtitle must be at least 5 characters")
        .max(100, "Subtitle must be at most 100 characters")
        .required("Subtitle is required"),
      image: Yup.mixed().required("Banner image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!previewImage) {
          toast.error("Please upload a banner image");
          return;
        }
       setLoadingAPI(true);

        if (editMode) {
          await handleEditSubmit(values, resetForm);
        } else {
          const uploadedImageUrl = await uploadImage(previewImage, "banners");

          const response = await createBanner({
            product: values.product._id,
            title: values.title,
            subTitle: values.subTitle,
            image: uploadedImageUrl,
          }).unwrap();

          toast.success(response.message);
          await fetchBannersData();
          resetForm();
          setPreviewImage(null);
        }
      } catch (err) {
        toast.error(
          Array.isArray(err?.data?.message)
            ? err.data.message?.[0]
            : err.data.message || err?.error || "error occured"
        );
        console.error(err);
      } finally {
        setLoadingAPI(false);
      }
    },
  });

  // Edit Handlers
  const handleEdit = (banner) => {
    setBannerToEdit(banner);
    setPreviewImage(banner.image);
    setEditMode(true);

    // Find the corresponding product for the banner
    const product = productsList.find((p) => p._id === banner.product._id);

    formik.setValues({
      product: product,
      title: banner.title,
      subTitle: banner.subTitle,
      image: banner.image,
    });

    scrollToForm();
  };

  const handleEditSubmit = async (values, resetForm) => {
    try {
      let uploadedImageUrl = previewImage;

      // Upload new image if changed
      if (uploadedImageUrl !== bannerToEdit.image) {
        uploadedImageUrl = await uploadImage(uploadedImageUrl, "banners");
      }

      const response = await updateBanner({
        bannerId: bannerToEdit._id,
        product: values.product._id,
        title: values.title,
        subTitle: values.subTitle,
        image: uploadedImageUrl,
      }).unwrap();

      toast.success(response.message);
      resetForm();
      setPreviewImage(null);
      setEditMode(false);
      setBannerToEdit(null);
      scrollToForm();
      await fetchBannersData();
    } catch (err) {
      toast.error(err.data.message || "error occured");
      if (import.meta.env.VITE_FRONTEND_ENV === 'development') console.log(err);
    }
  };

  // Toggle Active/Inactive
  const confirmIsActiveToggle = async () => {
    if (!toggleBanner) return;

    try {
      const response = await updateBannerIsActive({
        bannerId: toggleBanner._id,
      }).unwrap();

      toast.success(response.message);
      await fetchBannersData();
    } catch (err) {
      if (import.meta.env.VITE_FRONTEND_ENV === 'development')  console.log(err);
      toast.error(err?.data?.message || "An error occurred");
    } finally {
      setIsModalOpen(false);
    }
  };

  // Scroll to form
  const scrollToForm = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Table headers and rows
  const headers = [
    "Product",
    "Title",
    "Subtitle",
    "Image",
    "Status",
    "Actions",
  ];
  const rows =
    banners && banners.length > 0
      ? banners.map((banner) => [
          <div className="flex items-center">
            <img
              src={banner.product?.thumbnail} // Assuming your options have an `image` property for the picture URL
              alt={banner.product?.productName}
              style={{
                width: 40,
                height: 40,
                marginRight: 10,
                borderRadius: "50%", // Optional for circular images
              }}
              className="hidden md:flex"
            />
            {banner.product?.productName}
          </div>,
          banner.title,
          banner.subTitle,
          <img
            src={banner.image}
            alt={banner.title}
            className="h-10 w-10 object-cover mx-auto"
          />,
          <Switch
            checked={banner.isActive}
            onChange={() => {
              setToggleBanner(banner);
              setIsModalOpen(true);
            }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "green",
                "&:hover": { backgroundColor: "rgba(0, 128, 0, 0.1)" },
              },
              "& .MuiSwitch-track": {
                backgroundColor: banner.isActive ? "green" : "red",
              },
            }}
          />,
          <div className="flex flex-col space-y-1">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleEdit(banner)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(banner)}
            >
              Delete
            </Button>
          </div>,
        ])
      : [];

  ////-------------------------render component-------------
  if (bannersQueryLoading || offerProductsLoading) return <LoadingScreen />;

  return (
    <div className="p-4" style={{ color: themeStyles.backgroundColor }}>
      <AdminBreadCrumbs />
      <h1
        className="text-2xl font-bold mb-4"
        style={{ color: themeStyles.textPrimary }}
      >
        Banner Management
      </h1>

      {/* Add/Edit Banner Form */}
      <div ref={scrollRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit(formik.values);
          }}
          className="p-4 rounded shadow-sm mb-4 space-y-3"
          style={{
            color: themeStyles.textPrimary,
            backgroundColor: themeStyles.surface,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextField
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
              label="Banner Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              size="small"
              fullWidth
            />

            <TextField
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
              label="Banner Subtitle"
              name="subTitle"
              value={formik.values.subTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subTitle && Boolean(formik.errors.subTitle)}
              helperText={formik.touched.subTitle && formik.errors.subTitle}
              size="small"
              fullWidth
            />
            <Autocomplete
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
              options={productsList}
              getOptionLabel={(option) => option.productName}
              value={formik.values.product}
              onChange={(_, newValue) => {
                formik.setFieldValue("product", newValue);
              }}
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={option._id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={option.thumbnail} // Assuming your options have an `image` property for the picture URL
                    alt={option.productName}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 10,
                      borderRadius: "50%", // Optional for circular images
                    }}
                  />
                  {option.productName}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Product"
                  error={
                    formik.touched.product && Boolean(formik.errors.product)
                  }
                  helperText={formik.touched.product && formik.errors.product}
                />
              )}
              fullWidth
            />

            {/* Image Upload Section */}
            <div className="flex flex-col items-center">
              {!previewImage ? (
                <div
                  className="p-2 border border-gray-300 rounded-md cursor-pointer"
                  onClick={() =>
                    document.getElementById("banner-image").click()
                  }
                >
                  <input
                    style={{ display: "none" }}
                    id="banner-image"
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (
                        file &&
                        ![
                          "image/jpeg",
                          "image/webp",
                          "image/avif",
                          "image/jpg",
                          "image/png",
                        ].includes(file.type)
                      ) {
                        toast.error(
                          "Only JPG, JPEG, and PNG files are allowed.",
                         
                        );
                        event.target.value = null; // Reset the input value if invalid file type
                      } else {
                        handleImageChange(event);
                        formik.setFieldValue("image", event.target.files[0]);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <span className="text-gray-500 text-center block">
                    Click to upload and crop Banner Image
                  </span>
                </div>
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
                      formik.setFieldValue("image", null);
                    }}
                  />
                </div>
              )}

              {formik.touched.image && Boolean(formik.errors.image) && (
                <span className=" text-red-500 font-thin">
                  {formik.errors.image}
                </span>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          {loadingAPI ? (
            <Button
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
                {editMode ? "Update Banner" : "Add Banner"}
              </Button>
              {editMode && (
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    formik.resetForm();
                    setPreviewImage(null);
                    setEditMode(false);
                    setBannerToEdit(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </>
          )}
        </form>
      </div>

      {/* Banner Table */}
      <ReusableTable headers={headers} rows={rows} />

      {/* Pagination */}
      <RenderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProductsCount={totalBannersCount}
        itemsPerPage={itemsPerPage}
      />

      {/* Active/Inactive Modal */}
      <IsActiveToggleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmIsActiveToggle}
        message={`Are you sure you want to ${
          toggleBanner?.isActive ? "Deactivate" : "Activate"
        } this banner?`}
        buttonName={toggleBanner?.isActive ? "Deactivate" : "Activate"}
      />
      <BlockModal
        open={deleteConfirmModal}
        onClose={() => setDeleteConfirmModal(false)}
        onConfirm={confirmDeleteBanner}
        message={`Are you sure you want to delete this banner ?`}
        buttonName="Delete"
        loading={deleteBannerLoading}
      />

      {/* Image Cropper Modal */}
      {isCropperOpen && (
        <ImageCropperModal
          size={12 / 5} // Standard banner aspect ratio
          image={selectedImage}
          onCancel={handleCancelCrop}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default BannerPage;
