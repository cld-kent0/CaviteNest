import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Category } from "@/app/types/categories";
import dynamic from "next/dynamic";
import ProfileAvatar from "../ProfileAvatar"; // Assuming Avatar component is here
import ListingCategory from "./ListingCategory";
import { FaUserFriends, FaBed, FaBath } from "react-icons/fa"; // Importing icons
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone } from "react-icons/ai"; // Icon for amenities
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser | null;
  ownerContactNum: string | null | undefined;
  category: Category | undefined;
  description: string;
  roomCount: number;
  guestCount: number;
  bathroomCount: number;
  locationValue: string;
  amenities: string[]; // Added amenities prop
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  ownerContactNum,
  category,
  description,
  roomCount,
  guestCount,
  bathroomCount,
  locationValue,
  amenities, // Destructure amenities from props
}) => {
  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue)?.latlng;

  // Calculate the time on platform (similar to ProfileClient)
  const currentDate = new Date();
  const userJoinedDate = new Date(user?.createdAt || "");
  const years = differenceInYears(currentDate, userJoinedDate);
  const months = differenceInMonths(currentDate, userJoinedDate);
  const days = differenceInDays(currentDate, userJoinedDate);

  let timeOnPlatform = "";
  if (years > 0) {
    timeOnPlatform = `${years} year${years > 1 ? "s" : ""} on CaviteNest`;
  } else if (months > 0) {
    timeOnPlatform = `${months} month${months > 1 ? "s" : ""} on CaviteNest`;
  } else {
    timeOnPlatform = `${days} day${days > 1 ? "s" : ""} on CaviteNest`;
  }

  return (
    <div className="flex flex-col col-span-4 gap-8">
      <div className="flex items-center space-x-8">
        {" "}
        {/* space-x-4 will add some space between elements */}
        {/* Profile Box */}
        <div className="flex items-center p-5 border border-neutral-300 rounded-lg bg-white shadow-md w-68">
          <div className="flex flex-col items-center">
            <ProfileAvatar src={user?.image} key={user?.id} />
            <span className="text-neutral-700 mt-3 text-lg font-medium">
              {user?.name}
            </span>
            <span className="text-xs text-white bg-neutral-700 mt-1 px-2 py-0.5 rounded-full">
              Owner
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-light ml-2">
            {timeOnPlatform}
          </p>
        </div>
        <div className="flex flex-col items-start">
          {" "}
          {/* Stack email and phone number */}
          <p className="flex items-center text-sm text-neutral-500 mb-2">
            {" "}
            {/* Added margin-bottom */}
            <AiOutlineMail className="mr-2" /> {user?.email}
          </p>
          <p className="flex items-center text-sm text-neutral-500">
            <AiOutlinePhone className="mr-2" />{" "}
            {ownerContactNum ? ownerContactNum : "N/A"}
          </p>
        </div>
      </div>

      <hr />
      {/* Listing Details */}
      <div className="grid grid-cols-2 font-light text-neutral-500 gap-4">
        <div className="flex items-center">
          <FaUserFriends className="mr-1" />
          {guestCount} guests
        </div>
        <div className="flex items-center">
          <FaBed className="mr-1" />
          {roomCount} rooms
        </div>
        <div className="flex items-center col-span-2">
          <FaBath className="mr-1" />
          {bathroomCount} bathrooms
        </div>
      </div>

      <hr />

      {/* Category Info */}
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description as string}
        />
      )}

      <hr />

      {/* Description */}
      <div className="text-lg font-light text-neutral-500">{description}</div>

      <hr />

      {/* Amenities Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Amenities</h2>
        {amenities.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <AiOutlineCheck className="text-green-500 mr-2" />{" "}
                <span className="font-light text-neutral-600">{amenity}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-light text-neutral-600">
            No amenities chosen.
          </div>
        )}
      </div>

      <hr />

      {/* Map */}
      <Map center={coordinates} />
    </div>
  );
};

export default ListingInfo;
