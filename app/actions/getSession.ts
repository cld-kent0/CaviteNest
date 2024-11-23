import {getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function getSession() {
    return await getServerSession(authOptions);
}