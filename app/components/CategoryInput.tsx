"use client";
import { Category } from "../types/categories";

type CategoryInputProps = Pick<Category, "label" | "icon" | "selected"> & {
  onClick: (value: string) => void;
};

const CategoryInput = ({
  label,
  icon: Icon,
  selected,
  onClick,
}: CategoryInputProps) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`flex flex-col gap-3 p-4 border-2 rounded-xl hover:border-black transition cursor-pointer ${
        selected ? "border-black" : "border-neutral-200"
      }`}>
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
