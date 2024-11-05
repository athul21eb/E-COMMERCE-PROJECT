import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaShoppingBag, FaUsers, FaChartBar } from 'react-icons/fa';
import { MdCategory, MdOutlineSell, MdLocalOffer, MdLightMode, MdDarkMode, MdMenu } from 'react-icons/md';
import { IconButton, Drawer, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "../../../../contexts/themeContext.jsx";
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useAdminLogoutMutation } from "../../../../slices/auth/authApiSlice";
import Modal from "../../../common/Modals/Modal";
import toast from "react-hot-toast";

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
    {name:"Return Orders" , icon:MdOutlineSell,path:"return-orders"},
    {name:"Banners" , icon:MdCategory,path:"banners"},
  ];

  const [adminLogout ,{isLoading}]  = useAdminLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(() => {
    const path = location.pathname.split("/")[2];
    return menuItems.find((item) => item.path === path)?.name || "Dashboard";
  });

  const handleLogout = async () => {
    try {
      const response = await adminLogout().unwrap();
      
      toast.success(response.message);
      navigate("/admin/login");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }finally{
      setIsModalOpen(false);
    }
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: themeStyles.background }}>
      {/* Sidebar - shown only on md+ screens */}
      <aside 
        className="hidden md:flex w-16 md:w-40 flex-col items-center justify-between"
        style={{ 
          backgroundColor: themeStyles.surface,
          borderRight: `1px solid ${themeStyles.border}`
        }}
      >
        <div className="py-4 w-full flex justify-center">
          <img src={theme==="dark"?"/logo_white.png":"/LOGO.png"} alt="FIRE logo" className="object-contain w-16 h-12 md:w-20 md:h-16" />
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
                  className="flex items-center p-1 w-full rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedMenu === item.name ? themeStyles.accent : "transparent",
                    color: selectedMenu === item.name ? "#ffffff" : themeStyles.textSecondary,
                  }}
                >
                  <item.icon className="w-3 h-53" />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </motion.button>
              </li>
            ))}
          </ul>
          
          <div className="p-2  space-y-2">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-2 w-full rounded-lg transition-colors"
              style={{
                color: themeStyles.textPrimary,
                
              }}
            >
              {theme === "light" ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
              <span className="ml-3 hidden md:block">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </motion.button>

            {/* Logout Button styled as a menu item */}
            <motion.button
               onClick={() => {
                setIsModalOpen(true);
              }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-2 w-full rounded-lg transition-colors"
              style={{
                color: themeStyles.textPrimary,
                backgroundColor: selectedMenu === "Logout" ? themeStyles.accent : "transparent",
              }}
            >
              <RiLogoutBoxRLine size={24} className="text-red-500" />
              <span className="ml-3 hidden md:block text-red-500">Logout</span>
            </motion.button>
          </div>
        </nav>
      </aside>

      {/* Drawer for smaller screens */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <div
          className="w-64 flex flex-col h-full"
          style={{
            backgroundColor: themeStyles.surface,
            color: themeStyles.textPrimary,
          }}
        >
          <div className="py-4 w-full flex justify-center">
            <img src={theme==="dark"?"/logo_white.png":"/LOGO.png"} alt="FIRE logo" className="object-contain w-16 h-12 md:w-20 md:h-16" />
          </div>
          <nav className="flex-1 w-full">
            <ul className="space-y-2 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <motion.button
                    onClick={() => {
                      setSelectedMenu(item.name);
                      navigate(`/admin/${item.path}`);
                      toggleDrawer();
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center p-1 w-full rounded-lg transition-colors"
                    style={{
                      backgroundColor: selectedMenu === item.name ? themeStyles.accent : "transparent",
                      color: selectedMenu === item.name ? "#ffffff" : themeStyles.textSecondary,
                    }}
                  >
                    <item.icon className="w-3 h-3" />
                    <span className="ml-3">{item.name}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
            
            <div className="p-2  space-y-2">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-2 w-full rounded-lg transition-colors"
              style={{
                color: themeStyles.textPrimary,
                
              }}
            >
              {theme === "light" ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
              <span  className={`ml-3  ${theme === "light"?"text-black":"text-white"}`} >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </motion.button>

            {/* Logout Button styled as a menu item */}
            <motion.button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsModalOpen(true);
                }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-2 w-full rounded-lg transition-colors"
              
            >
              <RiLogoutBoxRLine size={24} className="text-red-500" />
              <span className="ml-3  text-red-500">Logout</span>
            </motion.button>
          </div>
          </nav>
        </div>
      </Drawer>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: themeStyles.background }}>
        {/* Header for mobile menu toggle */}
        <header
          className="flex items-center justify-between p-4 md:hidden mb-5"
          style={{ 
            backgroundColor: themeStyles.surface,
            borderBottom: `1px solid ${themeStyles.border}`
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <MdMenu size={28} style={{ color: themeStyles.textPrimary }} />
          </IconButton>
          <h1 className="text-lg font-semibold" style={{ color: themeStyles.textPrimary }}>Admin Panel</h1>
        </header>

        <Outlet />

 <Modal
 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Logout"
            footer={
              <>
                <Button 
                    disabled={isLoading}
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
                  disabled={isLoading}
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
      </main>
    </div>
  );
};

export default AdminLayout;
