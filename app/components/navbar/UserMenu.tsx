import GetVerifiedModal from "../modals/GetVerifiedModal";
import useGetVerified from "@/app/hooks/useGetVerifiedModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const getVerifiedModal = useGetVerified();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      // If no user is logged in, open the login modal
      return loginModal.onOpen();
    } else if (currentUser.role === "LESSOR" && currentUser.idStatus === "verified") {
      // If the user is a verified LESSOR, open the rent modal
      return rentModal.onOpen();
    } else {
      // If the user is not a verified LESSOR, redirect to the profile page
      return getVerifiedModal.onOpen();
    }
  }, [currentUser, getVerifiedModal, loginModal, rentModal]);
  
  // Check if the user is a verified lessor
  const isVerifiedLessor = currentUser?.role === "LESSOR" && currentUser?.idStatus;

    // Check if the user is an admin
  const isAdmin = currentUser?.role === "ADMIN"

  // Check if the user is a verified lessor with a paid plan
  const isEligibleForBillingPortal =
    currentUser?.role === "LESSOR" &&
    currentUser?.idStatus &&
    currentUser?.plan !== "free"; // Replace with actual plan property

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden px-4 py-3 text-sm font-semibold transition rounded-full cursor-pointer md:block hover:bg-neutral-100"
        >
          Host your nest
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                {isAdmin && (
                  <MenuItem
                  onClick={() => router.push("/admin/dashboard")}
                  label="Admin Page"
                />
                )}
                <hr />
                <MenuItem
                  onClick={() => router.push("/profile")}
                  label="My Profile"
                />
                <hr />
                <MenuItem
                  onClick={() => router.push("/messages")}
                  label="Messages"
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="My favorites"
                />
                <MenuItem
                  onClick={() => router.push("/trips")}
                  label="My trips"
                />
                <hr />
                {isVerifiedLessor && (
                  <>
                    <MenuItem
                      onClick={() => router.push("/reservations")}
                      label="My reservations"
                    />
                    <MenuItem
                      onClick={() => router.push("/properties")}
                      label="My properties"
                    />
                    {isEligibleForBillingPortal && (
                    <MenuItem
                    onClick={() => {
                      // Redirects to the Stripe customer portal URL
                      window.location.href = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || "/";
                    }}
                    label="Billing Portal"
                    />
                    )}
                    <MenuItem
                      onClick={onRent}
                      label="Host your nest"
                    />
                  </>
                )}
                <hr />
                <MenuItem onClick={signOut} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem onClick={registerModal.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
      <GetVerifiedModal/>
    </div>
  );
};

export default UserMenu;
