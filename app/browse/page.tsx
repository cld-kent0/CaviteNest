import getCurrentUser from "../actions/getCurrentUser";
import getListings, { IListingsParams } from "../actions/getListings";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
import { SafeListing } from "../types";
import ClientLayout from "../client-layout";

interface HomeProps {
  searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const currentUser = await getCurrentUser();

  let listings: any = [];

  if (searchParams && searchParams.userId) {
    listings = await getListings(searchParams);
  } else {
    listings = await getListings(searchParams);
  }

  // Filter out archived listings
  const activeListings = listings.filter(
    (listing: SafeListing) => !listing.is_archived
  );

  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <ClientOnly>
          {/* Main content area */}
          <div className="flex-grow">
            {activeListings.length === 0 ? (
              <EmptyState showReset />
            ) : (
              <Container>
                <hr className="md:w-[100px] md:h-[8px] w-[70px] h-[8px] bg-emerald-700 rounded ml-[20px] md:ml-[10px] mt-16 md:mt-24 mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold ml-[20px] md:ml-[10px] mb-9">
                  Properties
                </h2>
                <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {activeListings.map((item: SafeListing) => (
                    <div key={item.id}>
                      <ListingCard data={item} currentUser={currentUser} />
                    </div>
                  ))}
                </div>
              </Container>
            )}
          </div>
        </ClientOnly>
      </div>
    </ClientLayout>
  );
};

export default Home;
