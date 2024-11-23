// app/components/sidebar/Sidebar.tsx
import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  // Parse string fields into Date objects
  const parsedUser = currentUser
    ? {
        ...currentUser,
        createdAt: new Date(currentUser.createdAt),
        updatedAt: new Date(currentUser.updatedAt),
        emailVerified: currentUser.emailVerified
          ? new Date(currentUser.emailVerified)
          : null,
      }
    : null;

  return (
    <div className="h-full flex">
      <DesktopSidebar currentUser={parsedUser!} /> {/* Safe to use ! now */}
      <MobileFooter />
      <main className="lg:pl-20 h-full flex-grow">{children}</main>
    </div>
  );
}

export default Sidebar;
