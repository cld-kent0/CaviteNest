import { IconType } from "react-icons";

export interface Amenity {
  label: string;
  icon: IconType;
  description: string;
  selected?: boolean; // Added selected property to track if an amenity is chosen
}
