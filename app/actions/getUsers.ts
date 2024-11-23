import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import { SafeUser } from "../types"; // Import the SafeUser type

const getUsers = async (): Promise<SafeUser[]> => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users.map((user) => ({
      ...user,
      role: user.role,
      createdAt: user.createdAt ? user.createdAt.toISOString() : "",  // Convert to string (ISO)
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : "",  // Convert to string (ISO)
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,  // Convert to string or null
      favoriteIds: user.favoriteIds || [],
      seenMessageIds: user.seenMessageIds || [],
      resetPasswordToken: user.resetPasswordToken ?? null,
      conversationIds: user.conversationIds || [],
    }));
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default getUsers;
