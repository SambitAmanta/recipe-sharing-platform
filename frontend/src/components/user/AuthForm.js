import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { login, register, clearError } from "../../store/authSlice";
import Button from "../common/Button";
import Input from "../common/Input";

const AuthForm = ({ type = "login" }) => {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data) => {
    try {
      if (type === "login") {
        await dispatch(login(data)).unwrap();
        toast.success("Welcome back!");
      } else {
        await dispatch(register(data)).unwrap();
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      // Error is handled by the redux slice
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === "login" ? "Welcome Back" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === "register" && (
          <div>
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              register={registerField}
              error={errors.fullName?.message}
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              }}
            />
          </div>
        )}

        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            register={registerField}
            error={errors.email?.message}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />
        </div>

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            register={registerField}
            error={errors.password?.message}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />
        </div>

        {type === "register" && (
          <div>
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              register={registerField}
              error={errors.confirmPassword?.message}
              rules={{
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              }}
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : type === "login" ? "Login" : "Register"}
        </Button>
      </form>

      {/* Social Login Options */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => toast.info("Google login coming soon")}
            className="w-full"
          >
            <img className="h-5 w-5 mr-2" src="/google-icon.svg" alt="Google" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("Facebook login coming soon")}
            className="w-full"
          >
            <img
              className="h-5 w-5 mr-2"
              src="/facebook-icon.svg"
              alt="Facebook"
            />
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};
