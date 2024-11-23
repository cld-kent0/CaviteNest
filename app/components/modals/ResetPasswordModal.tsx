import { useState } from "react";
import Modal from "./Modal"; // Adjust the path if necessary
import Input from "../inputs/Input"; // Reusing Input component for consistency
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FieldError,
} from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface ResetPasswordModalProps {
  onClose: () => void;
  isOpen: boolean;
  token: string | null; // Ensure you have a token prop
}

export default function ResetPasswordModal({
  onClose,
  isOpen,
  token, // Accept the token prop
}: ResetPasswordModalProps) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>(); // Using FieldValues instead of FormData

  const password = watch("password"); // Watch for password value for matching validation

  const validatePasswordMatch = (value: string) => {
    if (password && value !== password) {
      return "Passwords do not match.";
    }
    return true; // Return true if passwords match
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setError(""); // Clear previous error messages

    // Your password reset logic here (API call)
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: data.password, token }), // Include the token
    });

    if (res.ok) {
      setMessage(""); // Clear any error messages
      setSuccess(true); // Set success message
      setTimeout(() => {
        onClose(); // Close modal after successful reset
      }, 2000); // Optional: close modal after 2 seconds
    } else {
      setMessage("Failed to reset password. Please try again.");
      setSuccess(false); // Reset success message on failure
    }
  };

  // Password requirement validation (similar to your login modal)
  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required.";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!/\d/.test(value)) {
      return "Password must include at least one number.";
    }
    if (!/[@$!%*?&]/.test(value)) {
      return "Password must include at least one special character (e.g., @$!%*?&).";
    }
    return true;
  };

  const bodyContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="text-gray-600 text-sm mb-4">
        <p>Please enter a new password and confirm it below.</p>
        <br />
        <p>
          Your new password must be at least 8 characters long, contain an
          uppercase letter, a number, and a special character.
        </p>
      </div>
      <div className="relative">
        <Input
          id="password"
          label="New Password"
          type={showPassword ? "text" : "password"} // Toggle password visibility
          register={register}
          errors={errors}
          required={true}
          validate={validatePassword} // Password validation function
          onChange={() => setMessage("")} // Clear any error messages on input change
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)} // Toggle showPassword state
          className="absolute right-5 top-5 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <AiOutlineEye size={28} />
          ) : (
            <AiOutlineEyeInvisible size={28} />
          )}
        </button>
      </div>

      <div className="relative">
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type={showPassword ? "text" : "password"} // Toggle confirmPassword visibility based on showPassword state
          register={register}
          errors={errors}
          required={true}
          validate={validatePasswordMatch} // Validate password match
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)} // Toggle showPassword state
          className="absolute right-5 top-5 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <AiOutlineEye size={28} />
          ) : (
            <AiOutlineEyeInvisible size={28} />
          )}
        </button>
      </div>

      {/* Error messages for form validation */}
      <div className="text-red-500 text-sm mt-2">
        {errors.password && <p>{(errors.password as FieldError).message}</p>}
        {errors.confirmPassword && (
          <p>{(errors.confirmPassword as FieldError).message}</p>
        )}
      </div>

      {/* General message display */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {message && !success && (
        <p className="text-red-500 text-sm mt-2">{message}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm mt-2">
          Password reset successful!
        </p>
      )}
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Reset Password"
      actionLabel="Reset Password"
      body={bodyContent}
    />
  );
}
