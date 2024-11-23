import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        absolute right-4 bottom-4 p-2 rounded-full
        ${outline ? "bg-white" : "bg-green-600"}
        ${outline ? "border-black" : "border-green-600"}
        ${outline ? "text-black" : "text-white"}
        ${small ? "py-2 px-3 text-xs" : "py-3 px-4 text-sm"}
        ${small ? "font-light" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
        hover:opacity-80 transition-opacity
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      {Icon && (
        <Icon
          size={16}
          className={`absolute left-2 top-2 ${small ? "top-1" : "top-2"}`}
        />
      )}
      {label}
    </button>
  );
};

export default Button;
