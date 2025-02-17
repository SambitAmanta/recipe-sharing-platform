import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiEdit2, FiSettings, FiBookmark } from "react-icons/fi";
import Button from "../common/Button";
import Modal from "../common/Modal";
import ProfileEditForm from "./ProfileEditForm";

const ProfileCard = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-bold">{user?.fullName}</h2>
        <p className="text-gray-600">{user?.email}</p>

        <div className="mt-4 flex gap-4">
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              /* TODO: Implement settings */
            }}
          >
            <FiSettings className="mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Section */}
        <div className="w-full mt-6 grid grid-cols-3 gap-4 border-t pt-6">
          <div className="text-center">
            <span className="block text-2xl font-bold">0</span>
            <span className="text-gray-600">Recipes</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold">0</span>
            <span className="text-gray-600">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold">0</span>
            <span className="text-gray-600">Following</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <ProfileEditForm onClose={() => setIsEditModalOpen(false)} />
      </Modal>
    </div>
  );
};
