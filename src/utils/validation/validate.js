// validation/SignUpValidationSchema.js
// utils/validate.js
import { min, max } from "date-fns";
import { shape, oneOf } from "prop-types";
import * as Yup from "yup";

//// -------------------------------SignUP----------------------------------------------
const signUpValidationSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("First Name is required"),
  lastName: Yup.string().trim().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email")
    .trim()
    .required("Email is required"),
  referral: Yup.string()
    .trim()
    .min(6, "referral Code must be at least 6 characters"),
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

//// --------------------------------offers----------------------------------------------

export const OfferSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(4, "title must be at least 4 characters")
    .required("Title is required"),
  description: Yup.string()
    .trim()
    .min(10, "description must be at least 10 characters")
    .required("Description is required"),
  discountPercentage: Yup.number()
    .required("Discount percentage is required")
    .min(1, "Discount must be at least 1%")
    .max(99, "Discount cannot exceed 99%"),
  type: Yup.string()
    .trim()
    .oneOf(["product", "category"], "Invalid offer type")
    .required("Offer type is required"),
  startDate: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("start date is required")
    .min(new Date(), "only future  date"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date cannot be earlier than start date"),
});

/////----------------------------------------coupon----------------------------------------

export const CouponSchema = Yup.object().shape({
  code: Yup.string()
    .trim()
    .matches(
      /^[A-Z0-9]+$/,
      "Coupon code must contain only uppercase letters and numbers"
    )
    .required("Coupon code is required")
    .min(5, "Coupon code must be at least 5 characters")
    .max(15, "Coupon code must be at most 15 characters"),

  discount: Yup.number()
    .required("Discount percentage is required")
    .min(1, "Minimum discount is 1%")
    .max(100, "Maximum discount is 100%"),

  expirationDate: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("Expiration date is required")
    .min(new Date(), "Expiration date must be in the future"),

  maxDiscountAmount: Yup.number()
    .required("Maximum discount amount is required")
    .min(1, "Minimum discount amount must be at least 1").max(2000,"maximum discount amount must be less than 2000"),

  minPurchaseAmount: Yup.number()
    .required("Minimum purchase amount is required")
    .min(1, "Minimum purchase amount must be at least 1"),
});
