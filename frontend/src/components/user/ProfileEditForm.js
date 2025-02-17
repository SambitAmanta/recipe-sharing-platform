import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../common/Button";
import Input from "../common/Input";

const ProfileEditForm = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      location: user?.location || "",
      websiteUrl: user?.websiteUrl || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: Implement update profile action
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        name="fullName"
        register={register}
        error={errors.fullName?.message}
        rules={{ required: "Full name is required" }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          {...register("bio")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Input label="Location" name="location" register={register} />

      <Input
        label="Website"
        name="websiteUrl"
        register={register}
        rules={{
          pattern: {
            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: "Please enter a valid URL",
          },
        }}
      />

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};
