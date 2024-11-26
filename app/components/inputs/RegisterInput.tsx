"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface RegisterInputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  options?: { value: string; label: string }[]; // Add options for select
  maxLength?: number; // Limit input length
  value?: string; // Controlled value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  validate?: (value: string) => true | string; // Validation function
}

const RegisterInput: React.FC<RegisterInputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  maxLength,
  options,
  value,
  onChange,
  onInput,
  validate,
}) => {
  const inputClassName = `peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
    ${formatPrice ? "pl-9" : "pl-4"}
    ${errors[id] ? "border-red-600" : "border-neutral-300"}
    ${errors[id] ? "focus:border-red-600" : "focus:border-black"}
  `;

  return (
    <div className="relative w-full">
      {/* Currency Symbol */}
      {formatPrice && (
        <span className="absolute text-neutral-700 top-5 left-2 text-lg">
          ₱
        </span>
      )}

      {/* Render Select Input */}
      {options ? (
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
        // Render Text Input
        <input
          id={id}
          disabled={disabled}
          type={type}
          placeholder=" "
          {...register(id, { required, validate })}
          value={value}
          maxLength={maxLength} // Apply maxLength directly to the input
          onChange={onChange}
          onInput={onInput}
          className={inputClassName}
        />
      )}

      {/* Label */}
      <label
        htmlFor={id}
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

export default RegisterInput;
