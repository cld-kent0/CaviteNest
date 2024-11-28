// app/profile/page.tsx

// Imports
import { getServerSession } from "next-auth/next";
import getCurrentUser from "../actions/getCurrentUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import ProfileClient from "./ProfileClient";
import ProfileModal from "../components/modals/ProfileModal";
import EditProfileModal from "../components/modals/EditProfileModal";
import UploadIdModal from "../components/modals/UploadIdModal";

// Profile Page Function
export default async function ProfilePage() {
  // Declarations
  const currentUser = await getCurrentUser();
  const session = await getServerSession(authOptions); // Fetch the session server-side

  // Check session
  if (!session || !session.user?.email) {
    return <p>Please sign in to view your profile.</p>;
  }

  // Check current user
  if (!currentUser) {
    return <p>Please sign in to view your profile.</p>;
  }

  // Fetch the user & profile collections from the database
  const [user, profile] = await prisma.$transaction([
    // Utilizing transaction method
    // Find from user
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        idStatus: true,
        idFront: true,
        idBack: true,
        idType: true,
        profileCreated: true,
        role: true,
        plan: true,
      },
    }),
    // Find from profile
    prisma.profile.findUnique({
      where: { userId: currentUser.id },
      select: {
        id: true,
        userId: true,
        contactNo: true,
        interest: true,
        location: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        imageSrc: true,
      },
    }),
  ]);

  // Check if there's no user
  if (!user) {
    return <p>There&apos;s no user!</p>;
  }

  // Return
  return (
    <>
      <div>
        <ProfileModal />
        <UploadIdModal />
        <EditProfileModal profile={profile} />
        <ProfileClient user={user} profile={profile} />
      </div>
    </>
  );
}
