import React, { useEffect } from "react";
import AddressForm from "../../../../components/common/AddressForm/AddressForm";
import LoadingBlurScreen from "../../../../components/common/LoadingScreens/LoadingBlurFullScreen";
import { useAddAddressMutation } from "../../../../slices/user/profile/address/addressApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddAddressPage = ({route="/addresses"}) => {
  const navigate = useNavigate();
  const [addAddress, { isLoading }] = useAddAddressMutation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleAddAddress = async (values) => {

    console.log(values);
    try {
      const response = await addAddress({
        data: values,
      }).unwrap();
      toast.success(response.message);
      navigate(route);
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingBlurScreen />;
  }
  return <AddressForm onSubmit={handleAddAddress} />;
};

export default AddAddressPage;
