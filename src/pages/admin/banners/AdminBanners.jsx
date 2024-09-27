import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
} from "@mui/material";
import { toast } from "react-toastify";
import { TiDelete } from "react-icons/ti";
import ImageCropperModal from "../../../components/common/ImageCropModals/ImageCropModal";

const BannerManagement = () => {
  const scrollRef = useRef(null);

  const [banners, setBanners] = useState([
    {
      _id: 1,
      title: "Summer Sale",
      description: "Up to 50% off on all items",
      imageUrl: "https://via.placeholder.com/150",
      isActive: true,
    },
    {
      _id: 2,
      title: "Winter Collection",
      description: "New arrivals for winter season",
      imageUrl: "https://via.placeholder.com/150",
      isActive: false,
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    imageUrl: null,
  });

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
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!previewImage) {
      toast.error("Please upload a banner image");
      return;
    }

    setLoadingAPI(true);

    if (editMode) {
      const updatedBanners = banners.map((banner) =>
        banner._id === bannerToEdit._id
          ? { ...bannerToEdit, ...formValues, imageUrl: previewImage }
          : banner
      );
      setBanners(updatedBanners);
      toast.success("Banner updated successfully!");
    } else {
      const newBanner = {
        _id: Date.now(),
        ...formValues,
        imageUrl: previewImage,
        isActive: false,
      };
      setBanners([...banners, newBanner]);
      toast.success("Banner added successfully!");
    }

    setFormValues({ title: "", description: "", imageUrl: null });
    setPreviewImage(null);
    setEditMode(false);
    setLoadingAPI(false);
  };

  const handleEditBanner = (banner) => {
    setBannerToEdit(banner);
    setFormValues({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
    });
    setPreviewImage(banner.imageUrl);
    setEditMode(true);
    scrollToForm();
  };

  const handleDeleteBanner = (bannerId) => {
    const updatedBanners = banners.filter((banner) => banner._id !== bannerId);
    setBanners(updatedBanners);
    toast.success("Banner deleted successfully!");
  };

  const handleToggleActive = (bannerId) => {
    const updatedBanners = banners.map((banner) =>
      banner._id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
    );
    setBanners(updatedBanners);
  };

  const scrollToForm = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">Banner Management</h1>

      {/* Add/Edit Banner Form */}
      <div ref={scrollRef}>
        <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded shadow-sm mb-4 space-y-3">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Title"
                name="title"
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Description"
                name="description"
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="flex flex-col items-center">
                {!previewImage ? (
                  <>
                    <div
                      className="p-2 border border-gray-300 rounded-md cursor-pointer"
                      onClick={() => document.getElementById("banner-image").click()}
                    >
                      <TextField
                        style={{ display: "none" }}
                        id="banner-image"
                        type="file"
                        name="imageUrl"
                        onChange={handleImageChange}
                        size="small"
                        fullWidth
                      />
                      <span className="text-gray-500 text-center block">
                        Click to upload and crop Banner Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mb-2 relative">
                    <img src={previewImage} alt="Preview" className="w-full h-40 object-contain rounded" />
                    <TiDelete
                      className="absolute top-0 right-0 text-red-500 cursor-pointer"
                      size={24}
                      onClick={() => setPreviewImage(null)}
                    />
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="small">
                {editMode ? "Update Banner" : "Add Banner"}
              </Button>
              {editMode && (
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setFormValues({ title: "", description: "", imageUrl: null });
                    setPreviewImage(null);
                    setEditMode(false);
                    setBannerToEdit(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </div>

      {/* Banner List */}
      <Paper className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Banner List</h2>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>isActive</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      <img src={banner.imageUrl} alt={banner.title} className="h-10 w-10 object-fill mx-auto" />
                    </TableCell>
                    <TableCell>{banner.title}</TableCell>
                    <TableCell>{banner.description}</TableCell>
                    <TableCell>
                      <Switch
                        checked={banner.isActive}
                        onChange={() => handleToggleActive(banner._id)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "green",
                            "&:hover": { backgroundColor: "rgba(0, 128, 0, 0.1)" },
                          },
                          "& .MuiSwitch-switchBase": {
                            color: "red",
                            "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => handleEditBanner(banner)}>
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={() => handleDeleteBanner(banner._id)}
                        startIcon={<TiDelete />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No banners found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Image Cropper Modal */}
      {/* <ImageCropperModal
        open={false}
        image={selectedImage}
        onComplete={handleCropComplete}
        onCancel={handleCancelCrop}
      /> */}
    </div>
  );
};

export default BannerManagement;
