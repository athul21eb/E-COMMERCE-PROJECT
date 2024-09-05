import React from "react";
import RoundedButton from "../../../common/ReusableButton/Button";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import firebaseApp from "../../../../utils/firebase/firebaseConfig.js";
import { useGoogleSignInMutation } from "../../../../slices/auth/authApiSlice.js";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../common/LoadingButtons/LoadingButton.jsx";
import { toast } from "react-toastify";

function GoogleOAuthButton({ Page }) {


  const [googleSingleSignOn, { isLoading }] = useGoogleSignInMutation();
const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const resultsFromGoogleAuth = await signInWithPopup(auth, provider);

      const {
        user: { email, displayName, photoURL, uid, emailVerified },
      } = resultsFromGoogleAuth;
      

      console.log(email, displayName, photoURL, uid, emailVerified);

      const response = await googleSingleSignOn({
        email,
        displayName,
        photoURL,
        uid,
        
      }).unwrap();
      toast.success(response.message);

      navigate("/")

      
      
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  if(isLoading){
    return  (
        <LoadingButton
          className="w-full mt-4 bg-blue-600 hover:bg-blue-950 text-white"
          loadingText="Please wait..."
        />
      );
  }

  return (

    <RoundedButton
      className="w-full mt-4 flex items-center justify-center bg-white hover:bg-gray-300 text-gray-700 border  border-gray-600"
      onClick={handleGoogleAuth}
    >
      <FcGoogle className="mr-2 size-5" /> {Page} with Google
    </RoundedButton>
  );
}

export default GoogleOAuthButton;
