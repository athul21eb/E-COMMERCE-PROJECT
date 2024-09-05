import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Avatar,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import RoundedButton from "../../../../components/common/ReusableButton/Button";
import LoadingButton from "../../../../components/common/LoadingButtons/LoadingButton";
import { useUpdateUserDetailsMutation } from "../../../../slices/user/profile/address/addressApiSlice";
import { toast } from "react-toastify";
import { uploadImage } from "../../../../utils/cloundinary/cloudinary";

const OverviewForm = () => {
  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();
  const { user } = useSelector((state) => state.auth?.authInfo);
  const [apiLoading, setApiLoading] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (user) {
      setInitialValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dob: user.DOB ? new Date(user.DOB).toISOString().split("T")[0] : "",
        email: user.email || "",
        mobile: user.mobile_no || "",
      });
      if (user.photo) {
        setAvatar(user.photo);
      }
    }
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues||{
      firstName:  "",
      lastName: "",
      dob:  "",
      email:"",
      mobile: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
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
    }),

    onSubmit: async (values, { resetForm }) => {
     
      try {
        if (!avatar) {
          toast.error("please select a avatar");
          return;
        }
        let uploadedImageUrL = avatar;
        setApiLoading(true);
        if (avatar !== user.photo) {
          uploadedImageUrL = await uploadImage(avatar, "userProfiles");
        }

        const response = await updateUserDetails({
          ...values,
          photo: uploadedImageUrL,
        }).unwrap();
        toast.success(response.message);
        resetForm();
      } catch (err) {
        // Display error message in case of failure
        toast.error(err?.data?.message || err?.error);
        console.error(err);
      } finally {
        setApiLoading(false);
      }
    },
  });
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Optional: Validate file type (e.g., only accept image files)
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result); // Set the avatar state with the image data URL
      };
      reader.readAsDataURL(file); // Convert the image file to a data URL
    }
  };

  return (
    <div className="mx-auto ">
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            margin: "0 auto",
            mb: 3,
          }}
        >
          <Box position="relative" sx={{ mr: 2 }}>
            <Avatar src={avatar} sx={{ width: 150, height: 150 }} />
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{ position: "absolute", bottom: 0, right: -10 }}
              >
                <FaEdit fontSize="2xl" color="red" />
              </IconButton>
            </label>
          </Box>
          <Box>
            <Typography variant="h5">{`${user?.firstName} ${user?.lastName}`}</Typography>

            <Typography variant="subtitle1">{`${user?.email}`}</Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="dob"
              name="dob"
              label="Date of Birth"
              type="date"
              value={formik.values.dob}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
              error={formik.touched.dob && Boolean(formik.errors.dob)}
              helperText={formik.touched.dob && formik.errors.dob}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="mobile"
              name="mobile"
              label="Mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ position: "relative" }}>
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
              size="small"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}{" "}
              {/* Toggle eye icon */}
            </button>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ position: "relative" }}>
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              size="small"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}{" "}
              {/* Toggle eye icon */}
            </button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          {apiLoading ? (
            <LoadingButton
              className="w-full  mt-4 bg-blue-600 hover:bg-blue-950 text-white"
              loadingText="Please wait..."
            />
          ) : (
            <RoundedButton
              type="submit"
              className="w-full  mt-4 bg-blue-600 hover:bg-blue-900 text-white py-2 rounded"
            >
              Update
            </RoundedButton>
          )}
        </Box>
      </form>
    </div>
  );
};

export default OverviewForm;
