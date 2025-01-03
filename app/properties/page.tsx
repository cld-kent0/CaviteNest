import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import PropertiesClient from "./PropertiesClient";
import ClientLayout from "../client-layout";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subTitle="Please login" />
      </ClientOnly>
    );
  }

  const listings = await getListings({
    userId: currentUser.id,
  });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No properties found"
          subTitle="Looks like You have no properties"
        />
      </ClientOnly>
    );
  }
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <ClientOnly>
          <div className="flex-grow">
            <PropertiesClient listings={listings} currentUser={currentUser} />
          </div>
        </ClientOnly>
      </div>
    </ClientLayout>
  );
};

export default PropertiesPage;
