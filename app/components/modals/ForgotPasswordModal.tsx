"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Modal from "./Modal";
import Input from "../inputs/Input"; // Import the Input component

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Use FieldValues instead of defining a custom FormData interface
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>(); // Now we are using FieldValues

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setError(""); // Clear previous error messages

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        setMessage("Reset email sent. Please check your inbox.");
      } else {
        const result = await res.json();
        setError(
          result?.message || "Error sending reset email. Please try again."
        );
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)} // Use handleSubmit from react-hook-form
      title="Forgot Password"
      actionLabel={isLoading ? "Sending..." : "Send Reset Email"}
      body={
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 mb-4">
            Enter the email address associated with your account, and we will
            send you a link to reset your password.
          </p>

          {/* Use the Input component for email input */}
          <Input
            id="email"
            label="Email Address"
            type="email"
            register={register} // Pass register from useForm
            errors={errors} // Pass errors from react-hook-form
            required={true}
          />

          {/* Error message for invalid email or other issues */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Success message */}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <p className="mt-4 text-sm text-gray-500">
            If you don’t receive an email, please check your spam folder or try
            again.
          </p>
        </div>
      }
    />
  );
}
