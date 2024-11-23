"use client";
import { Amenity } from "../types/amenities";

type AmenityInputProps = Pick<Amenity, "label" | "icon" | "selected"> & {
  onClick: (value: string) => void;
};

const AmenityInput = ({
  label,
  icon: Icon,
  selected,
  onClick,
}: AmenityInputProps) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`flex flex-col gap-3 p-4 border-2 rounded-xl hover:border-black transition cursor-pointer ${
        selected ? "border-black" : "border-neutral-200"
      }`}
    >
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default AmenityInput;
