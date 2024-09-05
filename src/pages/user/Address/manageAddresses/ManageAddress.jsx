import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetAddressesQuery,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "../../../../slices/user/profile/address/addressApiSlice";
import { useSelector } from "react-redux";
import LoadingBlurScreen from "../../../../components/common/LoadingScreens/LoadingBlurFullScreen";
import { AiOutlineArrowLeft } from "react-icons/ai";

const ManageAddresses = () => {
  const [fetchAddresses, { isLoading }] = useLazyGetAddressesQuery();
  const [removeAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const navigate = useNavigate();
  const { addresses } = useSelector((state) => state.userAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  useEffect(() => {
    if (addresses.length) {
      const defaultAddress = addresses.find(
        (address) => address.isDefaultAddress
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    }
  }, [addresses]);

  const handleSelectAddress = async (id) => {
    setSelectedAddress(id);
    try {
      await setDefaultAddress({ addressId: id }).unwrap();
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleEditAddress = (id) => {
    navigate(`/edit-addresses?id=${id}`);
  };

  const handleRemoveAddress = async (id) => {
    try {
      await removeAddress({ addressId: id }).unwrap();
    } catch (error) {
      console.error("Failed to remove address:", error);
    }
  };

  if (isLoading) {
    return <LoadingBlurScreen />;
  }

  return (
    <div className="max-w-5xl max-h-full mx-auto p-6 bg-white shadow-lg rounded-xl">
      <button
        className=" w-fit  bg-blue-500 text-white p-3 rounded-lg flex items-center"
        onClick={() => navigate("/checkOut")}
      >
        <AiOutlineArrowLeft className="mr-2" />{" "}
        {/* Icon with some right margin */}
        Back
      </button>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
        Manage Address
      </h2>
      {addresses?.length === 0 ? (
        <div className="text-6xl text-center">No Addresses</div>
      ) : (
        addresses.map((address) => (
          <div
            key={address._id}
            className={`border rounded-xl p-6 mb-6 transition-colors duration-300 ${
              selectedAddress === address._id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            {selectedAddress === address._id && (
              <span className="text-xs text-white bg-blue-500 px-3 py-1 rounded-full inline-block mb-4">
                Default
              </span>
            )}
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{`${address.firstName} ${address.lastName}`}</p>
                <p className="text-gray-600">{`${address.city},`}</p>
                <p className="text-gray-600">{`${address.district}, ${address.state}`}</p>
                <p className="text-gray-600">{`${address.pincode}`}</p>
                <p className="text-gray-600">{address.mobileNumber}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSelectAddress(address._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    selectedAddress === address._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {selectedAddress === address._id ? "Selected" : "Use Address"}
                </button>
                <button
                  onClick={() => handleEditAddress(address._id)}
                  className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveAddress(address._id)}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <FaTrashAlt className="mr-2" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      <div className="flex items-center justify-center my-4">
        <span className="text-gray-500 text-sm">OR</span>
      </div>
      <button
        onClick={() => navigate("/add-addresses")}
        className="flex items-center justify-center w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <FaPlusCircle className="mr-2" />
        Add New Address
      </button>
    </div>
  );
};

export default ManageAddresses;
