import * as Yup from 'yup';
 




export const addressSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("First Name is required")
    .matches(/^[a-zA-Z\s]+$/, "First Name must only contain alphabets and spaces")
    .max(50, "First Name must not exceed 50 characters"),
    
  lastName: Yup.string()
    .trim()
    .required("Last Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Last Name must only contain alphabets and spaces")
    .max(50, "Last Name must not exceed 50 characters"),
    
  state: Yup.string()
    .trim()
    .required("State is required")
    .matches(/^[a-zA-Z\s]+$/, "State must only contain alphabets and spaces")
    .max(50, "State must not exceed 50 characters"),
    
  district: Yup.string()
    .trim()
    .required("District is required")
    .matches(/^[a-zA-Z\s]+$/, "District must only contain alphabets and spaces")
    .max(50, "District must not exceed 50 characters"),
    
  city: Yup.string()
    .trim()
    .required("City is required")
    .matches(/^[a-zA-Z\s]+$/, "City must only contain alphabets and spaces")
    .max(50, "City must not exceed 50 characters"),
    
  pincode: Yup.string()
    .trim()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
    
  landmark: Yup.string()
    .trim()
    .max(100, "Landmark must not exceed 100 characters")
    .optional(), // Optional field
  
  mobileNumber: Yup.string()
    .trim()
    .required("Mobile Number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile Number must start with 6-9 and be exactly 10 digits"),
    
  alternateNumber: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Alternate Number must start with 6-9 and be exactly 10 digits")
    .notOneOf(
      [Yup.ref("mobileNumber")],
      "Alternate Number cannot be the same as Mobile Number"
    ),
});