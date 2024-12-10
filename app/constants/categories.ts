import { FiHome } from "react-icons/fi";
import { RiBuilding2Line } from "react-icons/ri";
import { GiBed } from "react-icons/gi";
import { FaCalendarAlt, FaSwimmer } from "react-icons/fa"; // Calendar and swimmer (pool) icons
import { Category } from "../types/categories";

export const categories = [
  {
    label: "House",
    icon: FiHome, // Home icon
    description: "This property is a house!",
  },
  {
    label: "Apartment",
    icon: RiBuilding2Line, // Building icon
    description: "This property is an apartment!",
  },
  {
    label: "Room",
    icon: GiBed, // Bed icon
    description: "This property is a room!",
  },
  {
    label: "Events Place",
    icon: FaCalendarAlt, // Calendar icon for events
    description: "This property is an events place!",
  },
  {
    label: "Resort",
    icon: FaSwimmer, // Pool / Swimming icon
    description: "This property is a resort with a pool!",
  },
] as Category[];
