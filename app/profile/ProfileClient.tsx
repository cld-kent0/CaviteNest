"use client"; // Client component

// Imports
import ProfileCard from "./ProfileCard";
import useProfileModal from "../hooks/useProfileModal";
import useEditProfileModal from "../hooks/useEditProfileModal";
import Link from "next/link";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import {
  formatDistanceToNow,
  differenceInMonths,
  differenceInYears,
  differenceInDays,
} from "date-fns";
import toast from "react-hot-toast";
import useUploadIdModal from "../hooks/useUploadIdModal";

// Import user values
type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  emailVerified: Date | null;
  idStatus: string | null;
  idFront: string | null;
  idBack: string | null;
  idType: string | null;
  profileCreated: boolean | null;
  role: string;
  plan: string;
};

// Import profile values
type Profile = {
  id: string;
  userId: string | null;
  contactNo: string | null;
  location: string | null;
  interest: string[] | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  imageSrc: string | null;
};

// Pass values into props
interface ProfileClientProps {
  user: User | null; // Expect user as a prop
  profile: Profile | null; // Expect profile as a prop
}

// ProfileClient Function
const ProfileClient: React.FC<ProfileClientProps> = ({ user, profile }) => {
  // Declarations
  const uploadIdModal = useUploadIdModal();
  const profileModal = useProfileModal();
  const editProfileModal = useEditProfileModal();
  const currentDate = new Date();

  // If there's no user, display none
  if (!user) {
    return <p>No user detected!</p>;
  }

  const userJoinedDate = new Date(user.createdAt);
  const years = differenceInYears(currentDate, userJoinedDate);
  const months = differenceInMonths(currentDate, userJoinedDate);
  const days = differenceInDays(currentDate, userJoinedDate);

  // Check if subscription is allowed based on role and ID verification status
  const canSubscribe = user.role === "LESSOR" && user.idStatus === "verified";

  // Time on Platform handler
  let timeOnPlatform = "";
  if (years > 0) {
    timeOnPlatform = `${years} year${years > 1 ? "s" : ""} on CaviteNest`;
  } else if (months > 0) {
    timeOnPlatform = `${months} month${months > 1 ? "s" : ""} on CaviteNest`;
  } else {
    timeOnPlatform = `${days} day${days > 1 ? "s" : ""} on CaviteNest`;
  }

  // Utility Function for Sentence casing all caps names...
  const toSentenceCase = (str: string) => {
    if (!str) return ""; // Return empty string if no name provided
    return str
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match: string) => match.toUpperCase());
  };

  const isPremiumOrBusiness =
    user.plan === "premium" || user.plan === "business";

  // Display user's created profile (if there's any)
  const isThereAProfile = user.profileCreated ? (
    <span>
      <ProfileCard
        header={toSentenceCase(user.name?.split(" ")[0] ?? "")}
        location={profile?.location || ""}
        email={user.email || ""}
        contactNo={profile?.contactNo || "n/a"}
        description={profile?.description || "No description added."}
        interest={profile?.interest || []}
      />
      {profile?.updatedAt && (
        <div className="flex justify-end mr-4">
          <p className="text-sm font-medium text-gray-600 items-center mt-12">
            Last updated:{" "}
            {formatDistanceToNow(new Date(profile.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      )}
    </span>
  ) : (
    <span>
      <h1 className="text-4xl font-bold">You have no profile created yet...</h1>
    </span>
  );

  // Check if user's email is verified (status text update)
  const isEmailVerified = user.emailVerified ? (
    <span className="font-bold text-green-600">✓ Email verified</span>
  ) : (
    <span className="text-orange-600">✗ Email address not verified</span>
  );

  // Check if user's ID has been verified (status text update)
  const isIdVerified =
    user.idStatus === "verified" ? (
      <span className="font-bold text-green-600">✓ Identity verified</span>
    ) : (
      <span className="text-gray-800">
        Before you book or host on CaviteNest, you’ll need to complete this
        step.
      </span>
    );

  // Check if user has created a profile (status text update)
  const isProfileCreated = user.profileCreated ? (
    <span className="font-bold text-green-600">
      ✓ Profile created
      <div className="flex justify-center">
        <button
          onClick={() => editProfileModal.onOpen()}
          className="
            border-2
            border-black
            w-72 
            mt-4 
            bg-green-600 
            text-white py-2 
            rounded-3xl
            font-semibold
            hover:bg-green-700
            hover:text-white 
            transition duration-300
            "
        >
          Edit Profile
        </button>
      </div>
    </span>
  ) : (
    <span className="text-gray-800">
      Your CaviteNest profile is an important part of every reservation. Create
      yours to help other Hosts and guests get to know you.
    </span>
  );

  // Email Verification Function
  const handleResendVerification = async () => {
    if (user.email) {
      try {
        const response = await fetch("/api/send-verification-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, id: user.id }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(`Verification email sent!`);
        } else {
          alert("Error sending verification email. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while sending the verification email.");
      }
    } else {
      alert("User email is not available.");
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-28 min-h-screen bg-gray-100 ">
      <div className="bg-white shadow-2xl shadow-slate-700 rounded-2xl p-11 w-full max-w-md pb-12 border-2 border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-30 h-30 rounded-full overflow-hidden bg-gray-300">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.name} Profile Picture`}
                width={85}
                height={85}
                className="object-cover"
              />
            ) : (
              <span className="text-3xl text-white flex items-center justify-center h-full bg-black">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex justify-center">
            <h2 className=" flex justify-center gap-1 mt-4 text-xl font-extrabold text-gray-800">
              {user.name || "Guest"}
              {/* Show the verified badge if the user is Premium or Business */}
              {isPremiumOrBusiness && (
                <MdVerified className="text-blue-600 text-2xl" />
              )}
            </h2>
          </div>
          <h3 className="text-gray-600"> {user.role} </h3>
          <p className="text-gray-600">( {timeOnPlatform} )</p>
        </div>

        <div className="text-center">
          <Link href="/subscription">
            <button
              className={`
                border-2
                border-black
                w-44 
                mt-4 
                bg-green-600 
                text-white py-2 
                rounded-3xl
                text-lg
                font-extrabold
                hover:bg-green-800
                hover:text-white 
                transition duration-300
                ${!canSubscribe ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={!canSubscribe} // Disable button when not allowed
            >
              Subscribe
            </button>
          </Link>
        </div>

        <hr className="h-[1px] my-7 mx-auto rounded bg-gray-600"></hr>

        <h3 className="text-xl font-semibold">Email Confirmation</h3>
        <div className="mt-2">
          <p className="text-gray-800">{isEmailVerified}</p>
        </div>
        <div className="text-center">
          {!user.emailVerified && (
            <button
              onClick={handleResendVerification}
              className="
              border-2
              border-black
              w-72 
              mt-4 
              bg-blue-600 
              text-white py-2 
              rounded-3xl
              font-semibold
              hover:bg-blue-800
              hover:text-white 
              transition duration-300
              "
            >
              Resend Verification Email
            </button>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">Identity Verification</h3>
          <p className="text-gray-800">
            {user?.idStatus === "verified" ? (
              <span className="font-bold text-green-600">
                ✓ Identity verified
              </span>
            ) : (
              <>
                <span className="text-gray-800">
                  Before you book or host on CaviteNest, you’ll need to complete
                  this step.
                </span>
                {/* <div className="text-black text-center mt-2"> <strong>Status:</strong> {user.idStatus} </div> */}
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2 mt-5 -mb-1 justify-center">
                    <div className="font-bold text-black"> Status: </div>
                    <div className="text-gray-800">
                      {user.idStatus === "unverified"
                        ? "Unverified"
                        : user.idStatus === "pending"
                        ? "Pending"
                        : "N/A"}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => uploadIdModal.onOpen()}
                      className="
                    border-2
                    border-black
                    w-72 
                    mt-4 
                    bg-green-600 
                    text-white py-2 
                    rounded-3xl
                    font-semibold
                    hover:bg-green-700
                    hover:text-white 
                    transition duration-300
                  "
                    >
                      Upload Government ID
                    </button>
                  </div>
                </div>
              </>
            )}
          </p>
        </div>

        <hr className="h-[1px] my-7 mx-auto rounded bg-gray-600"></hr>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">CaviteNest Profile</h3>
          <p className="text-gray-600">{isProfileCreated}</p>
          <div className="text-center">
            {!user.profileCreated && (
              <button
                onClick={() => profileModal.onOpen()}
                className="
                    border-2
                    border-black
                    w-72 
                    mt-4 
                    bg-green-600 
                    text-white py-2 
                    rounded-3xl
                    font-semibold
                    hover:bg-green-700
                    hover:text-white 
                    transition duration-300
                    "
              >
                Setup your profile
              </button>
            )}
          </div>
        </div>
      </div>
      <div>{isThereAProfile}</div>
    </div>
  );
};

export default ProfileClient;
