// pages/LoginPage.js
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginValidationSchema } from "../../../utils/validation/validate.js";
import RoundedButton from "../../../components/common/ReusableButton/Button.jsx";
import { useLoginMutation } from "../../../slices/auth/authApiSlice.js";
import { toast } from "react-toastify";
import LoadingButton from "../../../components/common/LoadingButtons/LoadingButton.jsx";
import GoogleOAuthButton from "../../../components/layout/user/googleOauthButton/GoogleOAuth.jsx";

const LoginPage = ({
  mutation = useLoginMutation,
  header = "Login",
  user = true,
}) => {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const navigate = useNavigate();
  const [login, { isLoading }] = mutation();

  const handleFormSubmit = async (values) => {
    console.log("Form submitted with data:", values);

    try {
      const response = await login({ ...values }).unwrap();

      // Display success message and navigate to the OTP page
      toast.success(response.message);

      
     if(user){
      navigate("/");
     }else{
      navigate("/admin/dashboard");
     }
    } catch (error) {
      // Display error message in case of failure
      toast.error(error?.data?.message || error?.error);
      console.error(error);
    }
    // Call API to login user
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4 space-y-6 bg-white  rounded-lg">
        <div className="flex flex-col items-center">
          <Link to="/" className="self-center">
            <img
              src="/LOGO.png"
              alt="FIRE logo"
              className="size-24 object-contain"
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold self-start">{header}</h2>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {() => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-600 rounded-full focus:outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"} // Toggle input type
                      placeholder="Password"
                      className="w-full px-3 py-2 border border-gray-600 rounded-full focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-2 flex items-center"
                    >
                      
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}{" "}
                      {/* Toggle eye icon */}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {user&&<div className="self-end">
                <Link to="/forgot-password" replace className="text-blue-500 hover:underline">
                  Forgot your password?
                </Link>
              </div>}
              {isLoading ? (
                <LoadingButton
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-950 text-white"
                  loadingText="Please wait..."
                />
              ) : (
                <RoundedButton
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-900 text-white py-2 rounded"
                >
                  LOGIN
                </RoundedButton>
              )}
              {user && (<>
              <div className="text-center mt-4 font-bold">OR</div>
             <GoogleOAuthButton Page={'Login'}/>
                <div className="text-center mt-4 ">
                  Don't have an account?
                  <Link
                    to="/sign-up"
                    className="text-blue-500 ml-1 font-bold hover:underline"
                  >
                    Sign Up
                  </Link>
                </div>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
