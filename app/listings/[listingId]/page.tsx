import getCurrentUser from "@/app/actions/getCurrentUser";
import { getListingById } from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import ListingClient from "@/app/listings/[listingId]/ListingClient";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import prisma from "@/app/libs/prismadb";
import ClientLayout from "@/app/client-layout";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  // Fetch profile data for the listing's user
  const profile = await prisma.profile.findUnique({
    where: {
      userId: listing?.userId, // Assuming `userId` is set in session or passed as a parameter
    },
    select: {
      id: true,
      userId: true,
      interest: true,
      contactNo: true,
      description: true,
      location: true,
    },
  });

  // If no listing is found, show the empty state
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  // Return the listing page with the profile passed to ListingClient
  return (
    <ClientLayout>
      <ClientOnly>
        <ListingClient
          listing={listing}
          profile={profile}
          currentUser={currentUser}
          reservations={reservations}
        />
      </ClientOnly>
    </ClientLayout>
  );
};

export default ListingPage;
