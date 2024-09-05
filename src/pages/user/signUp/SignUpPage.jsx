import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import RoundedButton from "../../../components/common/ReusableButton/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signUpValidationSchema } from "../../../utils/validation/validate.js";
import LoadingButton from "../../../components/common/LoadingButtons/LoadingButton.jsx";
import { useSignUpMutation } from "../../../slices/auth/authApiSlice.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SetCredentials } from "../../../slices/auth/authSlice.js";
import GoogleOAuthButton from "../../../components/layout/user/googleOauthButton/GoogleOAuth.jsx";

const SignUpPage = () => {
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Redux hooks for dispatching actions and navigating

  const navigate = useNavigate();
  
  // Hook for signing up a user with a mutation
  const [signUser, { isLoading }] = useSignUpMutation();

  // Handle form submission
  const handleFormSubmit = async (values) => {
    console.log("Form submitted with data:", values);

    try {
      // Attempt to sign up the user
      const response = await signUser(values).unwrap();
     

      

      // Display success message and navigate to the OTP page
      toast.success(response.message);
      navigate("/otp");
      
    } catch (error) {
      // Display error message in case of failure
      toast.error(error?.data?.message || error.error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4 space-y-6 bg-white rounded-lg">
        <div className="flex flex-col items-center">
          {/* Logo at the top of the sign-up form */}
          <Link to="/" className="self-center">
            <img
              src="/LOGO.png"
              alt="FIRE logo"
              className="size-20 object-contain"
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold self-start">SignUp</h2>
        </div>

        {/* Formik for handling form state, validation, and submission */}
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            mobile_no: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signUpValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              {/* Name Fields (First Name and Last Name) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2 border border-gray-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border border-gray-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Mobile Number Field */}
              <div>
                <Field
                  id="mobile_no"
                  name="mobile_no"
                  type="number"
                  placeholder="Mobile No"
                  className="w-full px-4 py-2 border border-gray-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <ErrorMessage
                  name="mobile_no"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Fields (Password and Confirm Password) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className=" col-span-2 sm:col-span-1">
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-gray-500 rounded-full focus:outline-none pr-10"
                  />
                  {/* Button to toggle password visibility */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full px-3 py-2 border border-gray-500 rounded-full focus:outline-none pr-10"
                  />
                  {/* Button to toggle confirm password visibility */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              </div>

              {/* Submit Button with Loading State */}
              {isLoading ? (
                <LoadingButton
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-950 text-white"
                  loadingText="Please wait..."
                />
              ) : (
                <RoundedButton
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-950 text-white"
                  disabled={isSubmitting}
                >
                  SignUp
                </RoundedButton>
              )}

              {/* Alternative Sign Up with Google */}
              <div className="text-center mt-2 font-bold">OR</div>
              <GoogleOAuthButton Page={'SignUp'}/>

              {/* Link to Login Page */}
              <div className="flex items-center justify-center mt-2 ">
                Already have an account?
                <Link
                  to="/login"
                  className="text-blue-500 hover:underline font-bold ml-1"
                >
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpPage;
