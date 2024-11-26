import getCurrentUser from "../actions/getCurrentUser";
import getFavorites from "../actions/getFavorites";
import ClientLayout from "../client-layout";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoritesClient from "./FavoritesClient";

const FavoritesPage = async () => {
  const currentUser = await getCurrentUser();
  const favlistings = await getFavorites();

  if (favlistings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState title="No favorites" subTitle="You have no favorites yet" />
      </ClientOnly>
    );
  }

  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <ClientOnly>
          <div className="flex-grow">
            <FavoritesClient
              favlistings={favlistings}
              currentUser={currentUser}
            />
          </div>
        </ClientOnly>
      </div>
    </ClientLayout>
  );
};

export default FavoritesPage;
