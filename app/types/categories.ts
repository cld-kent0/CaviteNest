import { IconType } from "react-icons";

export interface Category {
  label: string;
  icon: IconType;
  description?: string;
  selected?: boolean;
}

export interface CountrySelectValue {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
}
