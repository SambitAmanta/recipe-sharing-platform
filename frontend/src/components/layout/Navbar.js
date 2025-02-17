import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiSearch, FiUser, FiBookmark, FiLogOut } from "react-icons/fi";
import Button from "../common/Button";

const Navbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/recipes/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    // Will implement logout logic later
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 lg:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                RecipeShare
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FiBookmark className="h-6 w-6" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="small">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="small">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
