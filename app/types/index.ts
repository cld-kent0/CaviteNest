import { Listing, Reservation, User, Conversation, Message, UserRole } from "@prisma/client";

// Type for users that are subscribed (LESSOR, LESSEE, ADMIN roles)
export type SubscribedUser = {
  id: string;
  name: string | null;
  email: string;
  role: 'LESSOR' | 'LESSEE' | 'ADMIN';  // Using string literals for role types
};

// SafeUser extends the User model from Prisma and modifies certain fields
export type SafeUser = Omit<
  User,
  "hashedPassword" | "createdAt" | "updatedAt" | "emailVerified" | "favoriteIds" | "subscribed" | "role"
> & {
  role: UserRole;  // Role should be a string to accommodate dynamic roles
  createdAt: string;  // Convert createdAt to string (ISO date format)
  updatedAt: string;  // Convert updatedAt to string
  emailVerified: string | null;  // Allow null for email verification
  favoriteIds: string[];  // List of favorite item IDs
  subscribed?: boolean;  // Optional 'subscribed' field
  resetPasswordToken?: string | null;  // Optional reset password token
  conversationIds?: string[];  // Optional list of conversation IDs
  hashedPassword: string | null;
  seenMessageIds?: string[];  // Optional list of seen message IDs
};

// SafeListing extends Listing from Prisma and modifies the 'createdAt' field
export type SafeListing = Omit<
  Listing,
  "createdAt" // Omitting the original 'createdAt' field from the Listing type
> & {
  createdAt: string;  // Convert 'createdAt' to string (ISO date format)
  // Optionally add other modifications or extend further, e.g., add 'user' as SafeUser
};

// SafeReservation extends Reservation from Prisma and modifies several fields
export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing" | "users"
> & {
  createdAt: string;  // Convert 'createdAt' to string (ISO date format)
  startDate: string;  // Convert 'startDate' to string (ISO date format)
  endDate: string;  // Convert 'endDate' to string (ISO date format)
  listing: SafeListing;  // Linking to SafeListing for more controlled data
  users: SafeUser[];  // Linking to SafeUser for users involved in the reservation
};

// FullMessageType extends the Message model and adds 'sender' and 'seen' user lists
export type FullMessageType = Message & {
  sender: User;  // The user who sent the message
  seen: User[];  // The list of users who have seen the message
  image:string | null;
  images: string[];
};

// FullConversationType extends the Conversation model and includes users and messages
export type FullConversationType = Conversation & {
  users: User[];  // The list of users in the conversation
  messages: FullMessageType[];  // The list of messages in the conversation
};

// Extend NextAuth User and Session interfaces to include role and other custom properties
declare module "next-auth" {
  interface User {
    role: UserRole;  // Extending User type to include the 'role' property
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;  // Adding 'role' to the session user
      name: string;
      image?: string;  // Optional image field
    };
  }
}

// Extend NextAuth JWT interface to include role
declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;  // Adding 'role' to the JWT object
  }
}
