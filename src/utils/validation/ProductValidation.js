import * as Yup from "yup";

const addProductValidationSchema = Yup.object({
  productName: Yup.string().trim().required("Product Name is required"),
  description: Yup.string().trim().required("Description is required"),
  category: Yup.string().trim().required("Category is required"),
  brand: Yup.string().trim().required("Brand is required"),

  regularPrice: Yup.number().required("Regular Price is required").positive(),
  salePrice: Yup.number().required("Sale Price is required").positive(),
  thumbnail: Yup.mixed().required("Thumbnail image is required"),
  gallery: Yup.array().min(1, "At least one gallery image is required"),
  stockAndSize: Yup.array()
    .of(
      Yup.object().shape({
        stock: Yup.number().required("Stock is required").positive().integer(),
        size: Yup.number().required("size is required").positive().integer(),
      })
    )
    .min(1, "At least one stock and size combo is required"),
});

const editProductValidationSchema = Yup.object({
  productName: Yup.string().trim().required("Product Name is required"),
  description: Yup.string().trim().required("Description is required"),
  category: Yup.string().trim().required("Category is required"),
  brand: Yup.string().trim().required("Brand is required"),

  regularPrice: Yup.number().required("Regular Price is required").positive(),
  salePrice: Yup.number().required("Sale Price is required").positive(),

  stockAndSize: Yup.array()
    .of(
      Yup.object().shape({
        stock: Yup.number().required("Stock is required").positive().integer(),
        size: Yup.number().required("size is required").positive().integer(),
      })
    )
    .min(1, "At least one stock and size combo is required"),
});

export { addProductValidationSchema, editProductValidationSchema };
