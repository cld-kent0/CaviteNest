// app/subscription/page.tsx

import SubscriptionPageClient from "./SubscriptionPageClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const SubscriptionPage = async() => {
    const session = await getServerSession(authOptions); // Fetch the session

    // Check session
    if (!session || !session.user?.email) {
        return <p>Please sign-in first.</p>;
    }

    return <SubscriptionPageClient/>;
};

export default SubscriptionPage;