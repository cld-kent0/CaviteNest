// app/archived-properties/page.tsx (Server Component)
import { cookies } from "next/headers";
import { SafeUser } from "@/app/types";
import ArchivedPropertiesPage from "./ArchivedPropertiesPage"; // Assuming this is your Client Component

// The Server Component fetches the currentUser from cookies
const ArchivedPropertiesPageWrapper = async () => {
  // Get session cookie (or other data) from the request context
  const userCookie = cookies().get("user"); // Adjust the cookie name if necessary

  // If the cookie exists, parse the value to get the current user, otherwise, set it to null
  const currentUser: SafeUser | null = userCookie
    ? JSON.parse(userCookie.value)
    : null;

  // Pass the currentUser to the Client Component
  return <ArchivedPropertiesPage currentUser={currentUser} />;
};

export default ArchivedPropertiesPageWrapper;
