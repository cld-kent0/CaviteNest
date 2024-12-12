import { FaWifi, FaSwimmingPool, FaCar, FaDumbbell, FaHotTub, FaTv, FaGamepad, FaMicrophone, FaTableTennis, FaPaw, FaWheelchair, } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService, MdAir, MdViewComfy, MdBusiness, MdLuggage, MdTableRestaurant } from "react-icons/md";
import { IoThermometerOutline, IoWaterSharp } from "react-icons/io5";
import { AiOutlineCoffee } from "react-icons/ai";
import { GiFireplace, GiBarbecue, GiPoolTriangle, GiElevator } from "react-icons/gi";
import { MdBathtub, MdShower } from "react-icons/md";
import { FiGlobe } from "react-icons/fi";
import { Amenity } from "../types/amenities";
import { TbGardenCart, TbGolf, TbMicrowave } from "react-icons/tb";
import { CgSmartHomeLight } from "react-icons/cg";

export const amenities: Amenity[] = [
  {
    label: "WiFi",
    icon: FaWifi,
    description: "Free high-speed WiFi available",
    categories: ["House", "Apartment", "Room", "Resort", "Events Place"],
  },
  {
    label: "Kitchen",
    icon: MdKitchen,
    description: "Fully equipped kitchen for cooking",
    categories: ["House", "Apartment", "Resort"],
  },
  {
    label: "Parking space",
    icon: FaCar,
    description: "Free parking available on the premises",
    categories: ["House", "Apartment", "Resort", "Room", "Events Place"],
  },
  {
    label: "Air conditioning",
    icon: MdAir,
    description: "Air conditioning to keep you cool",
    categories: ["House", "Apartment", "Room", "Resort"],
  },
  {
    label: "Heating",
    icon: IoThermometerOutline,
    description: "Heating to keep you warm during winters",
    categories: ["House", "Apartment", "Room"],
  },
  {
    label: "Washer",
    icon: MdLocalLaundryService,
    description: "Washer available for your laundry needs",
    categories: ["House", "Apartment", "Room"],
  },
  {
    label: "Dryer",
    icon: MdLocalLaundryService,
    description: "Dryer available for your laundry needs",
    categories: ["House", "Apartment", "Room"],
  },
  {
    label: "TV",
    icon: FaTv,
    description: "Flat-screen TV with cable",
    categories: ["House", "Apartment", "Room", "Resort"],
  },
  {
    label: "Pool",
    icon: FaSwimmingPool,
    description: "Outdoor or indoor swimming pool",
    categories: ["Resort", "House", "Events Place"],
  },
  {
    label: "Gym",
    icon: FaDumbbell,
    description: "In-house gym for fitness enthusiasts",
    categories: ["House", "Resort", "Apartment", "Events Place"],
  },
  {
    label: "Hot tub",
    icon: FaHotTub,
    description: "Relax in the hot tub after a long day",
    categories: ["Resort", "House", "Events Place"],
  },
  {
    label: "Coffee maker",
    icon: AiOutlineCoffee,
    description: "Coffee maker to brew fresh coffee",
    categories: ["House", "Apartment", "Room"],
  },
  {
    label: "Fireplace",
    icon: GiFireplace,
    description: "Cozy fireplace to warm up your space",
    categories: ["House", "Resort", "Events Place"],
  },
  {
    label: "Barbecue",
    icon: GiBarbecue,
    description: "Outdoor barbecue for grilling",
    categories: ["House", "Resort", "Events Place"],
  },
  {
    label: "Bathtub",
    icon: MdBathtub,
    description: "Relaxing bathtub for your comfort",
    categories: ["House", "Apartment", "Resort", "Events Place"],
  },
  {
    label: "Shower",
    icon: MdShower,
    description: "Walk-in shower for convenience",
    categories: ["House", "Apartment", "Resort", "Events Place"],
  },
  {
    label: "Global concierge",
    icon: FiGlobe,
    description: "Concierge services for arranging bookings and travel",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Pet-friendly",
    icon: FaPaw, 
    description: "Pets are welcome on the property",
    categories: ["House", "Apartment", "Resort", "Events Place"],
  },
  {
    label: "Balcony",
    icon: MdViewComfy, 
    description: "Private balcony with a scenic view",
    categories: ["House", "Apartment", "Resort", "Events Place"],
  },
  {
    label: "Garden",
    icon: TbGardenCart, 
    description: "Beautiful garden area for relaxation",
    categories: ["House", "Resort", "Events Place"],
  },
  {
    label: "Elevator",
    icon: GiElevator,
    description: "Elevator access for upper floors",
    categories: ["Apartment", "Resort", "Events Place"],
  },
  {
    label: "Business Center",
    icon: MdBusiness, 
    description: "A dedicated business center with internet access and meeting rooms",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Game Room",
    icon: FaGamepad,
    description: "Entertainment space with games, ping pong, and arcade",
    categories: ["Resort", "House", "Events Place"],
  },
  {
    label: "Luggage storage",
    icon: MdLuggage, 
    description: "Store your luggage before or after your stay",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Wheelchair accessible",
    icon: FaWheelchair,
    description: "Facilities designed to accommodate guests with mobility challenges",
    categories: ["House", "Apartment", "Resort", "Events Place"],
  },
  {
    label: "Smart home",
    icon: CgSmartHomeLight, 
    description: "Smart home features such as voice-controlled lighting, thermostat, and security",
    categories: ["House"],
  },
  {
    label: "Billiard table",
    icon: GiPoolTriangle,
    description: "A billiard table for recreational fun",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Arcade games",
    icon: FaGamepad,
    description: "A selection of arcade games for entertainment",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Table tennis",
    icon: FaTableTennis,
    description: "Table tennis for indoor recreation",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Mini-golf",
    icon: TbGolf,
    description: "Mini-golf course for some outdoor fun",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Karaoke",
    icon: FaMicrophone,
    description: "Sing your heart out with a karaoke system",
    categories: ["Resort", "Events Place"],
  },
  {
    label: "Microwave",
    icon: TbMicrowave,
    description: "Sing your heart out with a karaoke system",
    categories: ["Apartment", "Room"],
  },
  {
    label: "Hot water",
    icon: IoWaterSharp,
    description: "Sing your heart out with a karaoke system",
    categories: ["Apartment", "Room"],
  },
  {
    label: "Dining table",
    icon: MdTableRestaurant,
    description: "Sing your heart out with a karaoke system",
    categories: ["Apartment", "Room"],
  },
];
