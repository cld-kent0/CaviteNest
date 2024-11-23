import prisma from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma?.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    null;
  }
}

// import prisma from "@/app/libs/prismadb";
// import { authOptions } from "@/pages/api/auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";
// import { SafeUser } from "../types";


// export async function getSession() {
//   return await getServerSession(authOptions);
// }

// export default async function getCurrentUser() {
//   try {
//     const session = await getSession();

//     if (!session?.user?.email) {
//       return null;
//     }

//     const currentUser = await prisma?.user.findUnique({
//       where: {
//         email: session.user.email as string,
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         image: true,
//         role: true, // Ensure role is selected
//         createdAt: true,
//         updatedAt: true,
//         emailVerified: true,
//         favoriteIds: true, // Fetch favoriteIds if you want to include it
//       },
//     });

//     if (!currentUser) {
//       return null;
//     }

//     const safeUser: SafeUser = {
//       id: currentUser.id,
//       email: currentUser.email,
//       name: currentUser.name,
//       image: currentUser.image,
//       role: currentUser.role, // Ensure role is included
//       createdAt: currentUser.createdAt.toISOString(), // Convert to string
//       updatedAt: currentUser.updatedAt.toISOString(), // Convert to string
//       emailVerified: currentUser.emailVerified ? currentUser.emailVerified.toISOString() : null, // Convert to string or null
//       subscribed: false, // Required field when the Lessor what to post a property
//       favoriteIds: currentUser.favoriteIds || [], // Assign favoriteIds (default to empty array if not present)
//       resetPasswordToken: null, // Add this field
//       conversationIds: [],      // Add this field
//       seenMessageIds: [],       // Add this field
//       is_archived: false, // Add this property
//       plan: "free",             // Default or replace as per logic
//       profileCreated: true,      // Default to true
//       idVerified: false,         // Default to false
//       customerId: "customer-id"  // Default or replace as per logic
//     };

//     return safeUser;
//   } catch (error: any) {
//     null;
//   }
// }
