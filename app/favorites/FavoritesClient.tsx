import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listing/ListingCard";
import { SafeListing, SafeUser } from "../types";

interface FavoritesClientProps {
  favlistings: SafeListing[];
  currentUser?: SafeUser | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  favlistings,
  currentUser,
}) => {
  return (
    <Container>
      <Heading
        title="Favorites"
        subTitle="List of places you have favorited!"
      />
      <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {favlistings.map((fav) => (
          <ListingCard key={fav.id} data={fav} currentUser={currentUser} />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
