import { Category } from "../types/categories";
import { FaDoorOpen, FaShoppingCart } from "react-icons/fa";
import { MdLocalMovies, MdPhotoCamera } from "react-icons/md";
import { IoIosMusicalNotes } from "react-icons/io";
import { CgGames } from "react-icons/cg";

export const interests = [
  {
    label: "Outdoors",
    icon: FaDoorOpen,
    description: "",
  },
  {
    label: "Photography",
    icon: MdPhotoCamera,
    description: "",
  },
  {
    label: "Movies",
    icon: MdLocalMovies,
    description: "",
  },
  {
    label: "Music",
    icon: IoIosMusicalNotes,
    description: "",
  },
  {
    label: "Gaming",
    icon: CgGames,
    description: "",
  },
  {
    label: "Shopping",
    icon: FaShoppingCart,
    description: "",
  },
] as Category[];
