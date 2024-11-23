"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal"; // Assuming you have a Modal component already
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import ForgotPasswordModal from "./ForgotPasswordModal"; // Import the Forgot Password modal
import ResetPasswordModal from "./ResetPasswordModal"; // Import the Reset Password modal

const LoginModal: React.FC = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for Forgot Password modal
  const [showResetPassword, setShowResetPassword] = useState(false); // State for Reset Password modal
  const [resetToken, setResetToken] = useState<string | null>(null); // State for reset token

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue, // Add setValue for controlled input
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!agreed) {
      toast.error("You must agree to the Terms and Conditions.");
      return;
    }

    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("Logged in");
        router.refresh();

        // Fetch the current user to check the role
        getSession().then((session) => {
          if (session?.user?.role === "ADMIN") {
            router.push("/admin/dashboard");
            router.refresh();
          } else {
            router.push("/");
            router.refresh();
          }
        });

        router.refresh();
        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const handleOpenTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Check if there's a token in the URL when the component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl); // Set the reset token from URL
      setShowResetPassword(true); // Show reset password modal
    }
  }, []);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subTitle="Login to your account" center />
      <Input
        label="Email"
        id="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        value={watch("email")} // Use value from watch
        onChange={(e) => setValue("email", e.target.value)} // Update form state
      />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          id="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          value={watch("password")} // Use value from watch
          onChange={(e) => setValue("password", e.target.value)} // Update form state
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
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
      <div className="flex justify-end">
        <button
          className="text-green-600 hover:underline"
          onClick={handleForgotPassword} // Open Forgot Password modal
        >
          Forgot your password?
        </button>
      </div>

      <div className="flex items-center mb-0 pb-0">
        <input
          type="checkbox"
          id="agreement"
          checked={agreed}
          onChange={() => setAgreed((prev) => !prev)}
          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="agreement" className="text-sm text-gray-600">
          I agree to the
          <Link
            href="/privacy-policy"
            className="text-green-600 hover:underline mx-1"
            onClick={loginModal.onClose}
          >
            Privacy Policy
          </Link>
          and
          <button
            onClick={handleOpenTermsModal}
            className="text-green-600 hover:underline mx-1"
          >
            Terms and Conditions
          </button>
        </label>
      </div>
      {errors.agreement && (
        <span className="text-red-600 text-sm">
          You must agree to the terms.
        </span>
      )}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <div className="mt-4 font-light text-center text-neutral-500">
        <div className="flex items-center justify-center gap-2">
          <div>First time using CaviteNest?</div>
          <div
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Create an account
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        title="Login"
        actionLabel="Continue"
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
      />
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={handleCloseTermsModal}
        onAgree={() => setAgreed(true)} // Set agreed to true when user agrees
      />
      <ForgotPasswordModal
        onClose={handleCloseForgotPassword} // Close Forgot Password modal
        isOpen={showForgotPassword} // Control the visibility of the Forgot Password modal
      />
      {resetToken && (
        <ResetPasswordModal
          isOpen={showResetPassword}
          onClose={() => {
            setShowResetPassword(false);
            setResetToken(null); // Clear token on close
          }}
          token={resetToken} // Pass the token to the modal
        />
      )}
    </>
  );
};

export default LoginModal;
