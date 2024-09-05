// pages/OtpValidationPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { otpValidationSchema } from "../../../utils/validation/validate.js";
import { useDispatch, useSelector } from "react-redux";
import { useResendOTPMutation, useVerifyOTPMutation } from "../../../slices/auth/authApiSlice.js";
import { toast } from "react-toastify";
import LoadingButton from "../../../components/common/LoadingButtons/LoadingButton.jsx";


const OtpValidationPage = ({forgotPassword}) => {

  ////useState variables
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30); // Timer set to 60 seconds

////hooks variables
  const { user } = useSelector((state) => state.auth.authInfo);
  const [resendOTP] = useResendOTPMutation();
  const [verifyOTP,{isLoading}] = useVerifyOTPMutation();
const dispatch = useDispatch();
const navigate = useNavigate();

  ////callback - handle submission
  const handleFormSubmit = async(values) => {
 
    try {
      console.log("Form submitted with data:", values);
      if(forgotPassword){
       
        const response  = await verifyOTP({...values,email:user.email,forgotPassword:true}).unwrap();
        toast.success(response.message);
        navigate("/password-reset");
      }else{
        const response  = await verifyOTP({...values,email:user.email}).unwrap();
        toast.success(response.message);
        navigate("/");
       }
 //// OTP api
    
     
      
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } //
  };

  const handleResendOtp = async () => {
    try {
      setTimer(30); // Reset timer to 60 seconds
      setIsResendDisabled(true);
      if(forgotPassword){
 
        const response = await resendOTP({ email:user.email,forgotPassword:true }).unwrap();
      }else{
        
        const response = await resendOTP({ email:user.email }).unwrap();
      }
      console.log("Resend OTP clicked");

   
      toast.success(response.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } // Disable the resend button again
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm p-4 space-y-6 bg-white rounded-lg">
        <div className="flex flex-col items-center">
          <Link to="/" className="self-center">
            <img
              src="/LOGO.png"
              alt="FIRE logo"
              className="size-28 object-contain"
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold">OTP Validation</h2>
          <p className="text-center text-gray-600 mt-4">
            Enter the OTP sent to your email - {user?.email}.
          </p>
        </div>
        <Formik
          initialValues={{
            otp: "",
          }}
          validationSchema={otpValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {() => (
            <Form className="mt-8 space-y-6">
              <div>
                <Field
                  name="otp"
                  type="text"
                  placeholder="OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
             { isLoading? (
                <LoadingButton
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full"
                  loadingText="Please wait..."
                />
              ):<button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full"
              >
                SUBMIT
              </button>}
            </Form>
          )}
        </Formik>

        <div className="flex items-center justify-between mt-4">
          {isResendDisabled ? (
            <span className="text-gray-600">
              Resend OTP available in {timer} seconds
            </span>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpValidationPage;
