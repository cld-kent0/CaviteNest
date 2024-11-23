// // app/api/admin/lessees/route.ts
// import { NextResponse } from 'next/server';
// import prisma from "@/app/libs/prismadb";

// export async function GET() {
//   try {
//     // Fetch users with the role of 'LESSEE' and not archived
//     const lessees = await prisma.user.findMany({
//       where: {
//         role: 'LESSEE', // Filter by the LESSEE role
//         // is_archived: false, // Exclude archived users
//       },
//       select: { // Optionally, select only the fields you need
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         updatedAt: true,
//         is_archived: true,
//         // Add other fields as needed
//       },
//     });

//     // Return the response with lessees
//     return NextResponse.json(lessees);
//   } catch (error) {
//     console.error("Error fetching lessees:", error);
//     return NextResponse.error(); // Return an error response if something goes wrong
//   }
// }


// app/api/admin/lessees/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    // Fetch users with the role of 'LESSEE' and not archived
    const lessees = await prisma.user.findMany({
      where: {
        role: 'LESSEE', // Filter by the LESSEE role
        // is_archived: false, // Exclude archived users
      },
      select: { // Optionally, select only the fields you need
        id: true,
        name: true,
        email: true,
        createdAt: true,
        is_archived: true,
        idStatus: true,
        idFront: true,
        idBack: true,
        idType: true,
        image: true,        // Assuming you have this field (profile image)
      },
    });

    // Return the response with lessees
    return NextResponse.json(lessees);
  } catch (error) {
    console.error("Error fetching lessees:", error);
    return NextResponse.error(); // Return an error response if something goes wrong
  }
}
