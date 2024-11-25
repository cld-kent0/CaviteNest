import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import axios from "axios";
import { useCallback, useState } from "react";
import {
  FieldValues,
  SubmitHandler,
  useForm,
  FieldErrors,
} from "react-hook-form";
import toast from "react-hot-toast";
import Heading from "../Heading";
import Input from "../inputs/Input";
import RegisterInput from "../inputs/RegisterInput";
import Modal from "./Modal";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const RegisterModal = ({}) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false); // Privacy Policy Agreement
  const [agreedTerms, setAgreedTerms] = useState(false); // Terms Agreement
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset, // Use the reset function to reset the form
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

  const onError = (errors: FieldErrors<FieldValues>) => {
    if (errors.email) {
      toast.error("Invalid email format.");
    } else if (errors.name) {
      toast.error("Name is required.");
    } else if (errors.password) {
      toast.error("Password is required.");
    } else if (errors.confirmPassword) {
      toast.error("Confirm your password.");
    }
  };

  const passwordValidation = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
  };

  const validationResult = passwordValidation(password || "");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const email = data.email;

    // Check password requirements
    if (!validationResult.minLength) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!validationResult.hasUppercase) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!validationResult.hasLowercase) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    if (!validationResult.hasNumber) {
      toast.error("Password must contain at least one number.");
      return;
    }

    if (!validationResult.hasSpecialChar) {
      toast.error(
        "Password must contain at least one special character (@$!%*?&)."
      );
      return;
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Ensure user agrees to terms and privacy policy
    if (!(agreedPolicy && agreedTerms)) {
      toast.error(
        "You must agree to the Privacy Policy and Terms and Conditions."
      );
      return;
    }

    // Proceed with registration
    setIsLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Successfully registered!");
        registerModal.onClose();
        loginModal.onOpen();
        reset(); // Reset form fields after successful registration
      })
      .catch(() => {
        toast.error("Something went wrong. Try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    reset();
    registerModal.onClose();
    loginModal.onOpen();
    setAgreedPolicy(false); // Reset policy agreement
    setAgreedTerms(false); // Reset terms agreement
  }, [registerModal, loginModal, reset]);

  // Reset form fields when modal is closed
  const handleCloseModal = () => {
    registerModal.onClose();
    reset(); // Reset fields when modal is closed
    setAgreedPolicy(false); // Reset policy agreement
    setAgreedTerms(false); // Reset terms agreement
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to CaviteNest"
        subTitle="Create an account"
        center
      />
      <RegisterInput
        id="email"
        label="Email Address"
        type="email"
        register={register}
        errors={errors}
        required
        validate={(value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email format"
        }
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
          onChange={(e) => {
            // Update the password value directly when typing
            register("password").onChange(e);
          }}
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

      {/* Real-time password validation */}
      {(errors.password || touchedFields.password) && (
        <div className="text-sm mt-2">
          <div
            className={`${
              validationResult.minLength ? "text-green-500" : "text-red-500"
            }`}
          >
            - At least 8 characters
          </div>
          <div
            className={`${
              validationResult.hasUppercase ? "text-green-500" : "text-red-500"
            }`}
          >
            - At least one uppercase letter
          </div>
          <div
            className={`${
              validationResult.hasLowercase ? "text-green-500" : "text-red-500"
            }`}
          >
            - At least one lowercase letter
          </div>
          <div
            className={`${
              validationResult.hasNumber ? "text-green-500" : "text-red-500"
            }`}
          >
            - At least one number
          </div>
          <div
            className={`${
              validationResult.hasSpecialChar
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            - At least one special character (@$!%*?&)
          </div>
        </div>
      )}

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

      <div className="flex items-center ml-1">
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
        onClose={handleCloseModal} // Use the custom close handler to reset form
        onSubmit={handleSubmit(onSubmit, onError)}
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
