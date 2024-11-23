import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import TripsClient from "./TripsClient";

const TripPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subTitle="Please login" />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    userId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No trips found"
          subTitle="Looks like you have not reserved any trips"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      {/* Pass userId explicitly along with reservations and currentUser */}
      <TripsClient
        reservations={reservations}
        currentUser={currentUser}
        userId={currentUser.id} // Ensure userId is passed here
      />
    </ClientOnly>
  );
};

export default TripPage;
