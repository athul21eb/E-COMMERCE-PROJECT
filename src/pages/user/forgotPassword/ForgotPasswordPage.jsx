import { Link, replace, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import RoundedButton from "../../../components/common/ReusableButton/Button.jsx";
import LoadingButton from "../../../components/common/LoadingButtons/LoadingButton.jsx"; // Assuming you have a LoadingButton component
import { useResendOTPMutation } from "../../../slices/auth/authApiSlice.js";
import { toast } from "react-toastify";
import { SetCredentials } from "../../../slices/auth/authSlice.js";
import { useDispatch } from "react-redux";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [resendOTP, { isLoading }] = useResendOTPMutation();
  const forgotPasswordPageValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleFormSubmit = async (values) => {
    try {

    
      const response = await resendOTP({
        email: values.email,
        forgotPassword: true,
      }).unwrap();

      console.log("sended OTP for forgot password",response.email);
     dispatch (SetCredentials({email:response.email}));

      toast.success(response.message);
      navigate("/forgot-password-otp", replace);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } //
    // Add your logic to handle forgot password request
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4 space-y-6 bg-white rounded-lg">
        <div className="flex flex-col items-center">
          <Link to="/" className="self-center">
            <img
              src="/LOGO.png"
              alt="FIRE logo"
              className="size-24 object-contain"
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold self-start">
            Forgot Password
          </h2>
        </div>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={forgotPasswordPageValidationSchema}
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
              </div>
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
                  SEND OTP
                </RoundedButton>
              )}
              <div className="text-center mt-4">
                Remember your password?
                <Link
                  to="/login"
                  className="text-blue-500 ml-1 font-bold hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
