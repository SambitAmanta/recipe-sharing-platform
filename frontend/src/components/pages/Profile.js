import React from "react";
import { useSelector } from "react-redux";
import ProfileCard from "../components/user/ProfileCard";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Please log in to view your profile
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <ProfileCard />
        </div>

        {/* Recipe Grid */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">My Recipes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TODO: Add RecipeCard components here */}
            <div className="text-center py-8 text-gray-500">
              No recipes yet! Start sharing your favorite dishes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
