import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiPlusCircle,
  FiUser,
  FiSettings,
} from "react-icons/fi";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiCompass, label: "Explore", path: "/explore" },
    { icon: FiPlusCircle, label: "Create Recipe", path: "/recipe/create" },
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={`
      fixed left-0 top-16 h-full bg-white shadow-md transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:w-64
    `}
    >
      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 p-3 rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
