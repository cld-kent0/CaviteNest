// libs/prisma/fetchAdminDashboardData.ts

import { PrismaClient, UserRole } from "@prisma/client"; // Import UserRole from Prisma
const prisma = new PrismaClient();

export const fetchAdminDashboardData = async () => {
  // Fetch total lessors using UserRole
  const lessors = await prisma.user.count({
    where: {
      role: UserRole.LESSOR, // Using UserRole enum
    },
  });

  // Fetch total lessees using UserRole
  const lessees = await prisma.user.count({
    where: {
      role: UserRole.LESSEE, // Using UserRole enum
    },
  });

  return {
    lessors,
    lessees,
  };
};
