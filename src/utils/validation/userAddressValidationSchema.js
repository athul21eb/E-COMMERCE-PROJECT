import * as Yup from 'yup';
 



export const addressSchema =  Yup.object({
      firstName: Yup.string().trim().required("First Name is required"),
      lastName: Yup.string().trim().required("Last Name is required"),
      state: Yup.string().trim().required("State is required"),
      district: Yup.string().trim().required("District is required"),
      city: Yup.string().trim().required("City is required"),
      pincode: Yup.string().trim().required("Pincode is required"),
      landmark: Yup.string().trim(),
      mobileNumber: Yup.string()
        .trim()
        .required("Mobile Number is required")
        .matches(/^[0-9]{10}$/, "Mobile Number must be exactly 10 digits"),
      alternateNumber: Yup.string()
        .trim()
        .matches(/^[0-9]{10}$/, "Alternate Number must be exactly 10 digits"),
    });