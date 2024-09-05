import React, { useEffect, useState } from "react";
import AddressForm from "../../../../components/common/AddressForm/AddressForm";
import {
  useLazyGetAddressByIdQuery,
  useUpdateAddressMutation,
} from "../../../../slices/user/profile/address/addressApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBlurScreen from "../../../../components/common/LoadingScreens/LoadingBlurFullScreen";
import { toast } from "react-toastify";

const EditAddress = ({route="/addresses"}) => {
  const location = useLocation(); // This will give you access to the location object
const navigate = useNavigate();
  // Create an instance of URLSearchParams to parse the query string
  const queryParams = new URLSearchParams(location.search);

  // To get a specific query parameter value
  const id = queryParams.get("id");
  ////mutations and queries
  const [fetchAddressById] = useLazyGetAddressByIdQuery();
  const [updateAddress, { isLoading }] = useUpdateAddressMutation();

  const [address, setAddress] = useState({}); // Initialize an empty object to store the address data

  const fetchData = async () => {
    try {
      const response = await fetchAddressById({ id }).unwrap();

      setAddress(response.address);
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, []);

  const handleEditAddress = async (values) => {
    // Logic to handle adding the address, e.g., making an API call
    console.log("edited address:", values);

    try {
      const response = await updateAddress({
        data: values,
        addressId: id,
      }).unwrap();
      toast.success(response.message);
      navigate(route);
    } catch (err) {
      // Display error message in case of failure
      toast.error(err?.data?.message || err?.error);
      console.error(err);
    }
  };

  if(isLoading){

    return <LoadingBlurScreen/>;
  }

  return <AddressForm onSubmit={handleEditAddress} initialValues={address} />;
};

export default EditAddress;
