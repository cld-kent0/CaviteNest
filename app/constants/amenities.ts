// src/app/constants/amenities.ts
import { FaWifi, FaSwimmingPool, FaCar, FaDumbbell, FaHotTub, FaTv } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService, MdAir } from "react-icons/md";
import { IoThermometerOutline } from "react-icons/io5";
import { Amenity } from "../types/amenities";


export const amenities: Amenity[] = [
  {
    label: "WiFi",
    icon: FaWifi,
    description: "Free high-speed WiFi available",
  },
  {
    label: "Kitchen",
    icon: MdKitchen,
    description: "Fully equipped kitchen for cooking",
  },
  {
    label: "Free parking",
    icon: FaCar,
    description: "Free parking available on the premises",
  },
  {
    label: "Air conditioning",
    icon: MdAir,
    description: "Air conditioning to keep you cool",
  },
  {
    label: "Heating",
    icon: IoThermometerOutline,
    description: "Heating to keep you warm during winters",
  },
  {
    label: "Washer",
    icon: MdLocalLaundryService,
    description: "Washer available for your laundry needs",
  },
  {
    label: "Dryer",
    icon: MdLocalLaundryService,
    description: "Dryer available for your laundry needs",
  },
  {
    label: "TV",
    icon: FaTv,
    description: "Flat-screen TV with cable",
  },
  {
    label: "Pool",
    icon: FaSwimmingPool,
    description: "Outdoor or indoor swimming pool",
  },
  {
    label: "Gym",
    icon: FaDumbbell,
    description: "In-house gym for fitness enthusiasts",
  },
  {
    label: "Hot tub",
    icon: FaHotTub,
    description: "Relax in the hot tub after a long day",
  },
];
