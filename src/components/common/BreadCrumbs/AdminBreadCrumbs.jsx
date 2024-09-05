import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminBreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-gray-600 text-sm mb-2">
      <ol className="list-reset flex">
       
        {pathnames.map((value, index) => {
          // Handle custom labels
          const label = value === "admin" ? "Admin" : value;
          const to = `/admin/${pathnames.slice(1, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-500">{label}</span>
              ) : (
                <Link to={to} className="text-blue-600 hover:text-blue-700">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadCrumbs;
