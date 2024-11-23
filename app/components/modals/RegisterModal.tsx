import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Password validation rules
  const passwordValidation = {
    minLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password || ""),
    hasLowerCase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password || ""),
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Ensure passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Ensure password meets all requirements
    const validPassword = Object.values(passwordValidation).every((v) => v);
    if (!validPassword) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    setIsLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Successfully registered!");
        registerModal.onClose();
        loginModal.onOpen();
      })
      .catch(() => {
        toast.error("Something went wrong. Try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to CaviteNest"
        subTitle="Create an account"
        center
      />
      <Input
        label="Email"
        id="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        label="Name"
        id="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
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
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-5 top-5 focus:outline-none"
        >
          {showPassword ? (
            <AiOutlineEye size={28} />
          ) : (
            <AiOutlineEyeInvisible size={28} />
          )}
        </button>
      </div>

      <ul className="text-xs text-gray-500">
        <li
          className={
            passwordValidation.minLength ? "text-green-500" : "text-red-500"
          }
        >
          {passwordValidation.minLength ? "✔" : "✖"} At least 8 characters
        </li>
        <li
          className={
            passwordValidation.hasUpperCase ? "text-green-500" : "text-red-500"
          }
        >
          {passwordValidation.hasUpperCase ? "✔" : "✖"} At least one uppercase
          letter
        </li>
        <li
          className={
            passwordValidation.hasLowerCase ? "text-green-500" : "text-red-500"
          }
        >
          {passwordValidation.hasLowerCase ? "✔" : "✖"} At least one lowercase
          letter
        </li>
        <li
          className={
            passwordValidation.hasNumber ? "text-green-500" : "text-red-500"
          }
        >
          {passwordValidation.hasNumber ? "✔" : "✖"} At least one number
        </li>
        <li
          className={
            passwordValidation.hasSpecialChar
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {passwordValidation.hasSpecialChar ? "✔" : "✖"} At least one special
          character
        </li>
      </ul>

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          id="confirmPassword"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-5 top-5 focus:outline-none"
        >
          {showConfirmPassword ? (
            <AiOutlineEye size={28} />
          ) : (
            <AiOutlineEyeInvisible size={28} />
          )}
        </button>
      </div>

      {/* Dynamic Password Match/Do not Match Message */}
      <p
        className={`text-sm ${
          password && confirmPassword
            ? password === confirmPassword
              ? "text-green-500"
              : "text-red-500"
            : "text-gray-500"
        }`}
      >
        {password && confirmPassword
          ? password === confirmPassword
            ? "Passwords match!"
            : "Passwords do not match."
          : " "}
      </p>
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
          <div>Already have an account?</div>
          <div
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
