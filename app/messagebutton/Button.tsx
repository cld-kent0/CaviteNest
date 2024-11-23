import { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Required prop
  disabled?: boolean;
  danger?: boolean;
  secondary?: boolean;
  type?: "button" | "submit" | "reset"; // Adding the type prop
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  danger,
  secondary,
  type = "button", // Default type is 'button'
}) => {
  const baseClasses = "px-4 py-2 rounded font-medium transition-all";

  const primaryClasses = danger
    ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
    : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-800";

  const secondaryClasses = secondary
    ? "bg-transparent text-black hover:bg-gray-100" // Transparent background and no border
    : primaryClasses;

  const disabledClasses = "opacity-70 cursor-not-allowed";

  return (
    <button
      type={type} // Set the type of button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${
        disabled ? disabledClasses : secondaryClasses
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
