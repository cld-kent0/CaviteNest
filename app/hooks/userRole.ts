// hooks/useRole.tsx
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth for authentication


// interface UserRoleStatus {
//     isAdmin: boolean;
//     isLessor: boolean;
//     isLessee: boolean;
//     role: UserRole | undefined; // Make sure UserRole is imported
//   }

export const useRole = () => {
    //const { user, loading } = useUser(); // Access user data and loading state from UserContext
  const { data: session } = useSession();
  const userRole = session?.user?.role;

// if (loading) {
//     return { isAdmin: false, isLessor: false, isLessee: false, role: undefined };
//   }

  return {

    isAdmin: session?.user?.role === "ADMIN",
        isLessor: session?.user?.role === "LESSOR",
        isLessee: session?.user?.role === "LESSEE",
        role: session?.user?.role, // Add this line

        
    // isAdmin: userRole === 'ADMIN',
    // isLessor: userRole === 'LESSOR',   
    // isLessee: userRole === 'LESSEE',

    // isAdmin: user?.role === "ADMIN", // Check if user role is ADMIN
    // isLessor: user?.role === "LESSOR", // Check if user role is LESSOR
    // isLessee: user?.role === "LESSEE", // Check if user role is LESSEE
    // role: user?.role, // Return the user role



    // isAdmin: session?.user?.role === "ADMIN",
    //     isLessor: session?.user?.role === "LESSOR",
    //     isLessee: session?.user?.role === "LESSEE",
    //     role: session?.user?.role, // Add this line
  };
};
