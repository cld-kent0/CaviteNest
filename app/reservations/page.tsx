import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ClientLayout from "../client-layout";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import ReservationsClient from "./ReservationsClient";

const ReservationPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subTitle="Please login" />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    authorId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No reservations found"
          subTitle="Looks like you have no reservations on your properties"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <ClientOnly>
          <div className="flex-grow">
            <ReservationsClient
              reservations={reservations}
              currentUser={currentUser}
            />
          </div>
        </ClientOnly>
      </div>
    </ClientLayout>
  );
};

export default ReservationPage;
