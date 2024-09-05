// validation/SignUpValidationSchema.js
// utils/validate.js
import * as Yup from "yup";

//// -------------------------------SignUP----------------------------------------------
const signUpValidationSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("First Name is required"),
  lastName: Yup.string().trim().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email")
    .trim()
    .required("Email is required"),
  mobile_no: Yup.string()
    .trim()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/[a-z]/, "Password must have at least one lowercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must have at least one special character"
    )
    .matches(/^\S*$/, "Password must not contain any spaces"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

//// -------------------------------Login----------------------------------------------
const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    )
    .required("Password is required")
    .matches(/^\S*$/, "Password must not contain any spaces"),
});
//// -------------------------------OTP----------------------------------------------

export const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("Required")
    .matches(/^\S*$/, "Password must not contain any spaces"),
});

export { signUpValidationSchema, loginValidationSchema };

//// -------------------------------Category----------------------------------------------

export const CategoryValidationSchema = Yup.object().shape({
  categoryName: Yup.string().trim().required("Category Name is required"),
  categoryDescription: Yup.string().trim().required("Description is required"),
});
