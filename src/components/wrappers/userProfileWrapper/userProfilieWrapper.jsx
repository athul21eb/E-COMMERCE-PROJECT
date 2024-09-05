import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../../slices/auth/authApiSlice";
import { toast } from "react-toastify";
import Modal from "../../../components/common/Modals/Modal";
import { Button } from "@mui/material";

const UserProfileWrapper = () => {
  const { user } = useSelector((state) => state.auth?.authInfo);
  //model setup

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //navigate
  const navigate = useNavigate();

  // Assuming user details are stored in the Redux store's auth slice

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();

      // Display success message and navigate to the OTP page
      closeModal();
      navigate("/");
      toast.success(response.message);
    } catch (error) {
      // Display error message in case of failure
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <div className="w-full  bg-white h-24 text-start px-4 md:px-10 pt-5">
        <div className="mb-8 ">
          <h2 className="text-2xl md:text-3xl font-semibold">Account</h2>
          <p className="text-md md:text-lg text-gray-600  ">
            {user?.firstName}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row min-h-full bg-gray-100">
        {/* Sidebar */}
        <div className="w-full min-h-screen md:w-[13%] bg-white p-4 shadow-lg px-4 md:pl-10 md:pt-10">
          <nav className="flex flex-col space-y-4">
            <NavLink
              to="/account/overview"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-gray-700"
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-gray-700"
              }
            >
              My Orders
            </NavLink>
            <NavLink
              to="/account/addresses"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-gray-700"
              }
            >
              Manage Address
            </NavLink>
            <NavLink
              to="/account/wallet"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-gray-700"
              }
            >
              Wallet
            </NavLink>
          </nav>
          <div className="mt-8">
            <button
              onClick={openModal}
              className="flex items-center text-gray-700 hover:text-red-500"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 bg-slate-200">
          <Outlet />

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Confirm Logout"
            footer={
              <>
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <p>Are you sure you want to log out?</p>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default UserProfileWrapper;
