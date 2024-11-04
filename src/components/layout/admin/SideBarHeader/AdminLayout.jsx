import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

 // Import necessary icons from React Icons
 import { FaTachometerAlt, FaShoppingBag, FaUsers, FaChartBar } from 'react-icons/fa';
 import { MdCategory, MdOutlineSell, MdLocalOffer,   MdLightMode,
    MdDarkMode } from 'react-icons/md';
 
import { Menu, MenuItem, IconButton, Fade, Button } from "@mui/material";
import { useAdminLogoutMutation } from "../../../../slices/auth/authApiSlice";
import Modal from "../../../common/Modals/Modal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTheme } from "../../../../contexts/themeContext.jsx";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, themeStyles } = useTheme();


const menuItems = [
  { name: "Dashboard", icon: FaTachometerAlt, path: "dashboard" },
  { name: "Products", icon: FaShoppingBag, path: "products" },
  { name: "Customers", icon: FaUsers, path: "customers" },
  { name: "Category", icon: MdCategory, path: "category" },
  { name: "Brands", icon: MdCategory, path: "brands" },
  { name: "Orders", icon: MdOutlineSell, path: "orders" },
  { name: "Sales Report", icon: FaChartBar, path: "sales-report" },
  { name: "Coupons", icon: MdOutlineSell, path: "coupons" },
  { name: "Offers", icon: MdLocalOffer, path: "offers" },
];


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(() => {
    const path = location.pathname.split("/")[2];
    return menuItems.find((item) => item.path === path)?.name || "Dashboard";
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminLogout] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      const response = await adminLogout().unwrap();
      setIsModalOpen(false);
      toast.success(response.message);
      navigate("/admin/login");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: themeStyles.background }}>
      {/* Sidebar */}
      <aside 
        className="w-16 sm:w-20 md:w-40 flex flex-col items-center md:items-start"
        style={{ 
          backgroundColor: themeStyles.surface,
          borderRight: `1px solid ${themeStyles.border}` 
        }}
      >
        <div className="py-4 w-full flex justify-center">
          <img src="/LOGO.png" alt="FIRE logo" className="object-contain w-16 h-12 md:w-20 md:h-16" />
        </div>
        <nav className="flex-1 w-full">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <motion.button
                  onClick={() => {
                    setSelectedMenu(item.name);
                    navigate(`/admin/${item.path}`);
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center p-2 w-full rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedMenu === item.name ? themeStyles.accent : "transparent",
                    color: selectedMenu === item.name ? "#ffffff" : themeStyles.textSecondary,
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className="flex items-center justify-between p-4"
          style={{ 
            backgroundColor: themeStyles.surface,
            borderBottom: `1px solid ${themeStyles.border}`,
            color: themeStyles.textPrimary
          }}
        >
          <h1 className="text-lg md:text-xl font-semibold">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <IconButton 
              onClick={toggleTheme}
              style={{ color: themeStyles.textPrimary }}
            >
              {theme === "light" ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
            </IconButton>
            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              style={{ padding: 0 }}
            >
              <img className="h-8 w-8 rounded-full" src="/LOGO.jpeg" alt="Profile" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              TransitionComponent={Fade}
              PaperProps={{
                style: {
                  backgroundColor: themeStyles.surface,
                  color: themeStyles.textPrimary,
                  border: `1px solid ${themeStyles.border}`
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  setAnchorEl(null);
                  setIsModalOpen(true);
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </header>

        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-y-auto p-6"
          style={{ 
            backgroundColor: themeStyles.background,
            color: themeStyles.textPrimary 
          }}
        >
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Logout"
            footer={
              <>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    borderColor: themeStyles.border,
                    color: themeStyles.textPrimary
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleLogout}
                  style={{
                    backgroundColor: themeStyles.accent,
                    color: "#ffffff"
                  }}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <p style={{ color: themeStyles.textPrimary }}>
              Are you sure you want to log out?
            </p>
          </Modal>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;