import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaListAlt, FaMapMarkerAlt, FaWallet, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../../slices/auth/authApiSlice";
import { toast } from "react-toastify";
import Modal from "../../../components/common/Modals/Modal";
import { Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { motion } from "framer-motion";

const UserProfileWrapper = () => {
  const { user } = useSelector((state) => state.auth?.authInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      closeModal();
      navigate("/");
      toast.success(response.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const links = [
    { to: "/account/overview", label: "Overview", icon: FaUser },
    { to: "/account/orders", label: "My Orders", icon: FaListAlt },
    { to: "/account/addresses", label: "Manage Address", icon: FaMapMarkerAlt },
    { to: "/account/wallet", label: "Wallet", icon: FaWallet },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for large screens */}
      <motion.div
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:block w-[18%] bg-white p-4 shadow-lg"
      >
        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600">
            Account
          </h2>
          <p className="text-md md:text-lg text-gray-500 font-medium">
            {user?.firstName}
          </p>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center p-3 text-base rounded-lg transition-all ${
                  isActive
                    ? "text-indigo-700 bg-indigo-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="text-xl" />
              <motion.span
                className="ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {label}
              </motion.span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          onClick={openModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center mt-8 p-3 text-gray-600 hover:text-red-500"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="ml-2">Logout</span>
        </motion.button>
      </motion.div>

      {/* Sidebar Drawer for small screens */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        PaperProps={{
          sx: {
            width: "70%",
            maxWidth: 280,
            backgroundColor: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Account Info */}
        <div className="mb-8 mt-20 p-4 text-center">
          <h2 className="text-2xl font-bold text-indigo-600">Account</h2>
          <p className="text-lg text-gray-500 font-medium">
            {user?.firstName}
          </p>
        </div>

        {/* Navigation Links */}
        <List>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center ml-3 p-3 text-base rounded-lg transition-all ${
                  isActive
                    ? "text-indigo-700 bg-indigo-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
              onClick={toggleSidebar}
            >
              <ListItemIcon>
                <Icon className="text-xl" />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </NavLink>
          ))}
        </List>

        {/* Logout Button */}
        <Button
          onClick={() => {
            toggleSidebar();
            openModal();
          }}
          className="flex items-center mt-4 p-3 text-gray-600 hover:text-red-500"
          startIcon={<FaSignOutAlt className="text-xl" />}
        >
          Logout
        </Button>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 bg-slate-200">
        {/* Sidebar Toggle Button for small screens */}
       
<FaBars className="w-7 h-7 mb-5 md:hidden" onClick={toggleSidebar}/>
 


        <Outlet  />

        <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirm Logout"
        footer={
          <>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
      </div>

      {/* Logout Confirmation Modal */}
      
    </div>
  );
};

export default UserProfileWrapper;