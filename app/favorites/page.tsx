import getCurrentUser from "../actions/getCurrentUser";
import getFavorites from "../actions/getFavorites";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
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
    <ClientOnly>
      <FavoritesClient favlistings={favlistings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default FavoritesPage;
