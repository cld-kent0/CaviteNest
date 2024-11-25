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
import { MdHelpOutline } from "react-icons/md";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false); // Privacy Policy Agreement
  const [agreedTerms, setAgreedTerms] = useState(false); // Terms Agreement
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);

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

  const handleOpenTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const handleClosePolicyModal = () => {
    setPolicyModalOpen(false);
  };

  const openPolicyModal = () => {
    setPolicyModalOpen(true);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Ensure passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Ensure user agrees to the terms
    if (!(agreedPolicy && agreedTerms)) {
      toast.error(
        "You must agree to the Privacy Policy and Terms and Conditions."
      );
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
        label="Email : example@domain.com"
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

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreement"
          checked={agreedPolicy && agreedTerms} // Enabled only if both are agreed
          onChange={() => {}}
          disabled={!(agreedPolicy && agreedTerms)} // Disabled until both agreements
          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="agreement" className="text-sm text-gray-600">
          I agree to the
          <button
            onClick={openPolicyModal}
            className="text-green-600 hover:underline mx-1"
          >
            Privacy Policy
          </button>
          and
          <button
            onClick={handleOpenTermsModal}
            className="text-green-600 hover:underline mx-1"
          >
            Terms and Conditions
          </button>
        </label>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {
          if (!(agreedPolicy && agreedTerms)) {
            toast.error(
              "You must agree to the Privacy Policy and Terms and Conditions."
            );
            return;
          }
          signIn("google"); // Proceed only if agreements are confirmed
        }}
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
    <>
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
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={handleCloseTermsModal}
        onAgree={() => setAgreedTerms(true)} // Set terms as agreed
      />
      <PrivacyPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={handleClosePolicyModal}
        onAgree={() => setAgreedPolicy(true)} // Set policy as agreed
      />
    </>
  );
};

export default RegisterModal;
