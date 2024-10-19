import * as Yup from "yup";

 export  const userProfileValidation = Yup.object({
      firstName: Yup.string().trim().required("First Name is required"),
      lastName: Yup.string().trim().required("Last Name is required"),
      dob: Yup.date()
        .required("Date of Birth is required")
        .max(new Date(), "Date of Birth cannot be in the future"),

      mobile: Yup.string()
        .trim()
        .required("mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
      newPassword: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must have at least one uppercase letter")
        .matches(/[a-z]/, "Password must have at least one lowercase letter")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must have at least one special character"
        )
        .matches(/^\S*$/, "Password must not contain any spaces"), // Disallows spaces

      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    })