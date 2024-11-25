"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  options?: { value: string; label: string }[]; // Add options for select
  maxLength?: number; // New prop to limit the max length of the input - claud
  value?: string; // Add value prop to receive value from parent (form state)
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange handler
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  validate?: (value: string) => true | string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  maxLength, // naadd
  options, // Accept options for select
  value, // Receive value prop
  onChange, // Receive optional onChange handler
  onInput, // Receive onInput handler
  validate,
}) => {
  const inputClassName = `peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
    ${formatPrice ? "pl-9" : "pl-4"}
    ${errors[id] ? "border-rose-500" : "border-neutral-300"}
    ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
  `;
  // Handle input change and formatting if price is enabled
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (maxLength && value && value.length > maxLength) {
      value = value.slice(0, maxLength); // Truncate input if length exceeds maxLength
    }

    if (formatPrice) {
      // Remove all non-numeric characters except decimal points
      newValue = newValue.replace(/[^0-9.]/g, "");

      // If there's no value, set it to 0.00
      if (newValue === "") {
        newValue = "0.00";
      }

      // Split the number into integer and decimal parts
      const [integerPart, decimalPart] = newValue.split(".");

      // Format the integer part with commas
      const formattedInteger = parseInt(integerPart || "0").toLocaleString();

      // If there's no decimal part, set it to ".00"
      newValue = `${formattedInteger}${
        decimalPart ? "." + decimalPart.slice(0, 2) : ".00"
      }`;
    }

    // If onChange prop is passed (from parent), call it
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <div className="relative w-full">
      {formatPrice && (
        <span className="absolute text-neutral-700 top-5 left-2 text-lg">
          ₱
        </span>
      )}
      {options ? ( // Render select if options are provided
        <select
          id={id}
          disabled={disabled}
          {...register(id, { required, validate })}
          className={inputClassName}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required, validate })}
          placeholder=" "
          type={type}
          value={value} // Use value from form state or parent component
          onChange={handleChange} // Handle input change
          onInput={onInput} // Handle input event if provided
          maxLength={maxLength}
          className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                ${formatPrice ? "pl-9" : "pl-4"}
                ${errors[id] ? "border-red-600" : "border-neutral-300"}
                ${errors[id] ? "focus:border-red-600" : "focus:border-black"}
              `}
        />
      )}
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] ${
          formatPrice ? "left-9" : "left-4"
        } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
          errors[id] ? "text-red-600" : "text-zinc-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
