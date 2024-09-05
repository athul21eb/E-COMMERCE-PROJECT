import { Formik, Form, Field, ErrorMessage, replace } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import RoundedButton from "../../../../components/common/ReusableButton/Button.jsx"; // Assuming you have this component
import { useResetPasswordMutation } from "../../../../slices/auth/authApiSlice.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../../components/common/LoadingButtons/LoadingButton.jsx";
import { toast } from "react-toastify";

const SetNewPassword = () => {


  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const {email,resetPassword} = useSelector(state=>state?.auth?.authInfo?.user)
  const [resetPasswordApi, {isLoading}] = useResetPasswordMutation();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const setPasswordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .trim()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[a-z]/, "Password must have at least one lowercase letter")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must have at least one special character"
      ),
    confirmPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });
  

  const handleFormSubmit = async (values) => {
    
    try {

      const response = await resetPasswordApi({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        email,
      }).unwrap();
      toast.success(response.message);
      navigate("/login");
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  
  useEffect(()=>{
    

      if(!resetPassword||!email){
        navigate("/login",replace);
        return ;
      }
    
  },[])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg ">
        <div className="flex flex-col items-center">
          <img
            src="/LOGO.png"
            alt="FIRE logo"
            className="size-24 object-contain"
          />
          <h2 className="mt-4 text-2xl font-bold">Set New Password</h2>
          <p className="mt-2 text-sm text-center text-gray-600">
          {email&&email} -
            Creating a new password is easy. Enter the new password you want to
            create and repeat it.
          </p>
        </div>
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={setPasswordValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {() => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="  w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
               
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="  w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                
              </div>
             { isLoading?(
                <LoadingButton
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-950 text-white"
                  loadingText="Please wait..."
                />
              ):
              <RoundedButton
                type="submit"
                className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-900 text-white rounded-full"
              >
                PROCEED
              </RoundedButton>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SetNewPassword;
