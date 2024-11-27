import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";

import ImageCropperModal from "../../../../components/common/ImageCropModals/ImageCropModal";
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useLazyGetProductByIdQuery,
} from "../../../../slices/admin/products/productApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { uploadImage } from "../../../../utils/cloundinary/cloudinary.js";
import { toast } from "react-toastify";
import {
  useLazyGetBrandsListQuery,
  useLazyGetAllBrandsQuery,
} from "../../../../slices/admin/brands/brandsApiSlice";
import {
  useLazyGetCategoriesListQuery,
  useLazyGetAllCategoriesQuery,
} from "../../../../slices/admin/category/categoryApiSlice";
import { TiDelete } from "react-icons/ti";
import { editProductValidationSchema } from "../../../../utils/validation/ProductValidation.js";

import AdminBreadCrumbs from "../../../../components/common/BreadCrumbs/AdminBreadCrumbs.jsx";
import LoadingScreen from "../../../../components/common/LoadingScreens/LoadingScreen.jsx";
import LoadingBlurScreen from "../../../../components/common/LoadingScreens/LoadingBlurFullScreen.jsx";

const EditProductForm = () => {
  const location = useLocation(); // This will give you access to the location object

  // Create an instance of URLSearchParams to parse the query string
  const queryParams = new URLSearchParams(location.search);

  // To get a specific query parameter value
  const id = queryParams.get("id");

  ////mutations
  const [editProduct] = useUpdateProductMutation();

  //// Initialize lazy queries
  const [
    getProductById,
    { data: productData, isLoading: productLoading, isError: ProductError },
  ] = useLazyGetProductByIdQuery();
  const [
    triggerGetBrands,
    { data: brandsData, isLoading: brandsLoading, isError: brandsError },
  ] = useLazyGetAllBrandsQuery();

  const [
    triggerGetCategories,
    {
      data: categoriesData,
      isLoading: categoriesLoading,
      isError: categoriesError,
    },
  ] = useLazyGetAllCategoriesQuery();

  //// State to store brands and categories
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);

  /////useEffects

  // Fetch product data when the component mounts or when 'id' changes
  useEffect(() => {
    const fetchProductData = async () => {
      await getProductById(id);
    };
    if (id) {
      fetchProductData();
    }
  }, [getProductById, id]);

  // Log product data once fetched
  useEffect(() => {
    if (productData) {
      setCurrentProduct(productData?.product);
      
      setThumbnailPreview(productData?.product?.thumbnail);
      setGalleryPreviews(productData?.product?.gallery);
    }
  }, [productData]);

  useEffect(() => {
    // Trigger the lazy queries on component mount
    const fetchData = async () => {
      await triggerGetBrands();
      await triggerGetCategories();
    };

    fetchData();
  }, [triggerGetBrands, triggerGetCategories]);

  useEffect(() => {
    if (brandsData) {
      setBrands(brandsData);
    }
  }, [brandsData]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  ////form utility variables

  const [editProductIsLoading, setEditProductIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropperTarget, setCropperTarget] = useState(null);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    productName: currentProduct?.productName || "",
    description: currentProduct?.description || "",
    category: currentProduct?.category || "",
    brand: currentProduct?.brand || "",

    regularPrice: currentProduct?.regularPrice || "",
    salePrice: currentProduct?.salePrice || "",
    thumbnail: currentProduct?.thumbnail || null,
    gallery: currentProduct?.gallery || [],
    stockAndSize: currentProduct?.stock || [{ stock: "", size: "" }],
  });
  //// initial form values

  useEffect(() => {
    if (currentProduct) {
      

      //// initial form values
      setInitialValues({
        productName: currentProduct?.productName || "",
        description: currentProduct?.description || "",
        category: currentProduct?.category?._id || "",
        brand: currentProduct?.brand?._id || "",

        regularPrice: currentProduct?.regularPrice || "",
        salePrice: currentProduct?.salePrice || "",
        thumbnail: currentProduct?.thumbnail || null,
        gallery: currentProduct?.gallery || [],
        stockAndSize: currentProduct?.stock || [{ stock: "", size: "" }],
      });
    }
  }, [currentProduct]);

  ////handle callbacks
  const handleSubmit = async (values) => {
    if (!thumbnailPreview) {
      toast.error("Add a thumbNail image");
      return;
    }

    if (galleryPreviews.length < 1) {
      toast.error("Add a gallery image");
      return;
    }

    try {
      setEditProductIsLoading(true);
      let upLoadedThumbnail = thumbnailPreview;
      if (
        upLoadedThumbnail &&
        upLoadedThumbnail !== currentProduct?.thumbnail
      ) {
        upLoadedThumbnail = await uploadImage(thumbnailPreview, "ThumbNail");
      }

      let galleryImages = galleryPreviews;

      if (galleryImages && currentProduct?.gallery) {
        // Compare the current gallery with the new previews
        const isGallerySame = currentProduct.gallery.every((url, index) =>
          url === galleryPreviews[index]?.url // Assuming galleryPreviews contains objects with a 'url' field
        );
      
        // If the gallery is the same, skip the upload
        if (!isGallerySame) {
          galleryImages = await Promise.all(
            galleryPreviews.map(async (image) => {
              const response = await uploadImage(image, "GALLERY");
             
              return response;
            })
          );
        }
      }

      const response = await editProduct({
        productId: currentProduct._id,
        productName: values.productName,
        description: values.description,
        category: values.category,
        brand: values.brand,

        stock: values.stockAndSize,
        regularPrice: values.regularPrice,
        salePrice: values.salePrice,
        thumbnail: upLoadedThumbnail,
        gallery: galleryImages,
      }).unwrap();
      toast.success(response.message);
      navigate("/admin/products");
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    } finally {
      setEditProductIsLoading(false);
    }
  };

  const handleImageChange = (event, setFieldValue, target) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setIsCropperOpen(true);
        setCropperTarget(target);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);

    // Check if the total number of selected files plus already uploaded images exceeds 4
    if (galleryPreviews.length + files.length > 4) {
      toast.error("You can only upload up to 4 images.");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setIsCropperOpen(true);
        setCropperTarget("gallery");
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCropComplete = (croppedImage) => {
    if (cropperTarget === "thumbnail") {
      setThumbnailPreview(croppedImage);
    } else if (cropperTarget === "gallery") {
      setGalleryPreviews((prev) => [...prev, croppedImage]);
    }
    setIsCropperOpen(false);
  };

  const handleCancelCrop = () => {
    setIsCropperOpen(false);
  };

  const handleGalleryImageRemove = (preview) => {
    

    const filteredGalleryImages = galleryPreviews.filter(
      (galleryImage) => galleryImage !== preview
    );
    setGalleryPreviews(filteredGalleryImages);

   
  };

  const handleThumbNailImageRemove = () => {
    setThumbnailPreview(null);

    setFieldValue("thumbnail", null);
  };

  ////--------------component--------------------------------------------------------------

  if (brandsLoading || categoriesLoading || productLoading) {
    return <LoadingScreen />;
  }

  if (editProductIsLoading) {
    return <LoadingBlurScreen />;
  }
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-200 shadow-md rounded-md">
      <AdminBreadCrumbs />
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <Formik
        key={JSON.stringify(initialValues)} // Ensures form re-renders when initialValues change
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={editProductValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1.5">
              {/* Product Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Name
                </label>
                <Field
                  type="text"
                  name="productName"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Enter product name"
                />
                <ErrorMessage
                  name="productName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  multiline
                  rows={4} // Default number of rows
                  maxRows={8}
                  name="description"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Enter product description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <Field
                  as="select"
                  name="category"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                >
                  <option value="">Select Category</option>
                  {categories &&
                    categories?.categories.filter(x=>x?.isActive).map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Brand */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Brand
                </label>
                <Field
                  as="select"
                  name="brand"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                >
                  <option value="66b755b184370e8343901989">Select Brand</option>
                  {brands &&
                    brands?.brands.filter(x=>x?.isActive).map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.brandName}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Regular Price */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Regular Price
                </label>
                <Field
                  type="number"
                  name="regularPrice"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Enter regular price"
                />
                <ErrorMessage
                  name="regularPrice"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Sale Price */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Sale Price
                </label>
                <Field
                  type="number"
                  name="salePrice"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Enter sale price"
                />
                <ErrorMessage
                  name="salePrice"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-1.5">
              {/* Thumbnail Image */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Thumbnail Image
                </label>
                {thumbnailPreview && (
                  <div className="mb-2 relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-full h-40 object-contain rounded"
                    />
                    <TiDelete
                      className="absolute top-4 right-0 text-red-500 cursor-pointer"
                      size={24}
                      onClick={handleThumbNailImageRemove}
                    />
                  </div>
                )}
                {!thumbnailPreview && (
                  <>
                    <div
                      className="p-2 border border-gray-300 rounded-md cursor-pointer"
                      onClick={() =>
                        document.getElementById("thumbnail-upload").click()
                      }
                    >
                      <input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (
                            file &&
                            !["image/jpeg","image/webp" ,"image/avif", "image/jpg", "image/png"].includes(
                              file.type
                            )
                          ) {
                            toast.error(
                              "Only JPG, JPEG, and PNG files are allowed."
                            );
                            event.target.value = null; // Reset the input value if invalid file type
                          } else {
                            handleImageChange(
                              event,
                              setFieldValue,
                              "thumbnail"
                            );
                            setFieldValue("thumbnail", event.target.files[0]);
                          }
                        }}
                      />
                      <span className="text-gray-500 text-center block">
                        Click to upload and crop thumbnail
                      </span>
                    </div>
                  </>
                )}
                <ErrorMessage
                  name="thumbnail"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Gallery Images */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gallery Images
                </label>
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery Preview ${index + 1}`}
                          className="w-full h-40 object-contain rounded"
                        />
                        <TiDelete
                          className="absolute top-4 right-0 text-red-500 cursor-pointer"
                          size={24}
                          onClick={() => handleGalleryImageRemove(preview)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div
                  className="p-2 border border-gray-300 rounded-md cursor-pointer"
                  onClick={() => {
                    document.getElementById("gallery-upload").click();
                  }}
                >
                  <input
                    type="file"
                    id="gallery-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (
                        file &&
                        !["image/jpeg", "image/jpg", "image/png"].includes(
                          file.type
                        )
                      ) {
                        toast.error(
                          "Only JPG, JPEG, and PNG files are allowed."
                        );
                        event.target.value = null; // Reset the input value if invalid file type
                      } else {
                        handleGalleryChange(event, setFieldValue);
                        setFieldValue(
                          "gallery",
                          Array.from(event.target.files).slice(0, 4)
                        );
                      }
                    }}
                  />
                  <span className="text-gray-500 text-center block">
                    Click to upload and crop gallery images
                  </span>
                </div>
                <ErrorMessage
                  name="gallery"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Stock and Size */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stock and Size
                </label>
                <FieldArray name="stockAndSize">
                  {({ push, remove, form }) => (
                    <div>
                      {form.values.stockAndSize.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-2 mb-2"
                        >
                          <div>
                            <div className="flex items-center">
                              <span>size:</span>
                              <Field
                                name={`stockAndSize.${index}.size`}
                                placeholder="Size"
                                type="number"
                                className="border rounded w-full py-2 px-3 text-gray-700"
                              />
                            </div>
                            <ErrorMessage
                              name={`stockAndSize.${index}.size`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span>stock:</span>
                              <Field
                                name={`stockAndSize.${index}.stock`}
                                placeholder="Stock"
                                type="number"
                                className="border rounded w-full py-2 px-3 text-gray-700"
                              />
                            </div>
                            <ErrorMessage
                              name={`stockAndSize.${index}.stock`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            className="text-red-500 text-sm"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-blue-500 text-sm"
                        onClick={() => push({ stock: "", size: "" })}
                      >
                        Add Another
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="lg:col-span-2 flex justify-center space-x-4 mt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>

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

export default EditProductForm;
