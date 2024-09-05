import React, { useState } from "react";
import {
  Outlet,
  
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";
import { MdCategory, MdSettings, MdOutlineSell } from "react-icons/md";
import { Menu, MenuItem, IconButton, Fade } from "@mui/material";
import { useAdminLogoutMutation } from "../../../../slices/auth/authApiSlice";
import Button from "@mui/material/Button";
import Modal from "../../../common/Modals/Modal";
import { toast } from "react-toastify";
import clsx from "clsx";

const AdminLayout = () => {

  const location = useLocation();


  const menuItems = [
    { name: "Dashboard", icon: FaTachometerAlt, path: "dashboard" },
    { name: "Products", icon: FaShoppingBag, path: "products" },
    { name: "Customers", icon: FaUsers, path: "customers" },
    { name: "Category", icon: MdCategory, path: "category" },
    { name: "Brands", icon: MdCategory, path: "brands" },
    { name: "Orders", icon: MdOutlineSell, path: "orders" },
    { name: "Sales Report", icon: FaChartBar, path: "sales-report" },
    { name: "Coupons", icon: MdOutlineSell, path: "coupons" },
    { name: "Settings", icon: MdSettings, path: "settings" },
  ];

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(() => {
    const path = location.pathname.split("/")[2];
    console.log(path);
    
    const MenuItem = menuItems.find((item) => item.path === path);

    return  MenuItem ? MenuItem.name.toString() : "Dashboard";
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [adminLogout] = useAdminLogoutMutation();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await adminLogout().unwrap();
      closeModal();
      toast.success(response.message);
      navigate("/admin/login");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-16 sm:w-20 md:w-40 bg-white shadow-lg flex flex-col items-center md:items-start">
        <div className="py-4 pl-6 w-full flex justify-center">
          <img
            src="/LOGO.png"
            alt="FIRE logo"
            className="object-contain w-16 h-12 md:w-20 md:h-16"
          />
        </div>
        <nav className="flex-1  w-full">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setSelectedMenu(item.name);
                    navigate(`/admin/${item.path}`);
                  }}
                  className={clsx(
                    "flex items-center p-3 w-full rounded-lg text-gray-600  transition-colors",
                    {
                      "bg-blue-700 text-white": selectedMenu === item.name,
                      "hover:bg-blue-200 ": selectedMenu !== item.name,
                    }
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Admin Panel
          </h1>
          <div className="relative">
            <IconButton onClick={handleMenuClick} className="text-gray-800">
              <img
                className="h-8 w-8 rounded-full"
                src="/LOGO.jpeg"
                alt="FIRE logo"
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 150 }}
            >
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  openModal();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
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
                  color="primary"
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <p>Are you sure you want to log out?</p>
          </Modal>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
