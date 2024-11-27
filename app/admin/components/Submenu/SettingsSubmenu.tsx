import { useState } from 'react';
import SidebarItem from '../navbar/SidebarItem';
import { FiSettings, FiKey, FiShield, FiDatabase, FiBell, FiInfo } from 'react-icons/fi';
import { BiBook, BiBuildingHouse, BiCarousel, BiChevronDown, BiChevronUp, BiHistory, BiHomeHeart } from 'react-icons/bi';

interface SettingsSubmenuProps {
  isOpen: boolean;
  activePath: string;
  setActivePath: (path: string) => void;
}

const SettingsSubmenu = ({ isOpen, activePath, setActivePath }: SettingsSubmenuProps) => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <div>
      <SidebarItem
        icon={<FiSettings />}
        label={isOpen ? "Settings" : ""}
        isOpen={isOpen}
        path="#"
        activePath={activePath}
        setActivePath={() => setSettingsOpen(!isSettingsOpen)}
      >
        {isOpen && (isSettingsOpen ? <BiChevronUp /> : <BiChevronDown />)} {/* Pass the arrow icon as a child */}
      </SidebarItem>
      {isSettingsOpen && (
        <div className="pl-6 space-y-2">
          <SidebarItem
            icon={<BiBook />}
            label={isOpen ? "Archive" : ""}
            isOpen={isOpen}
            path="/admin/settings/archive"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          {/* <SidebarItem
            icon={<BiHomeHeart />}
            label={isOpen ? "Amenities" : ""}
            isOpen={isOpen}
            path="/admin/settings/amenities"
            activePath={activePath}
            setActivePath={setActivePath}
          /> */}
          <SidebarItem
            icon={<BiCarousel />}
            label={isOpen ? "Carousel" : ""}
            isOpen={isOpen}
            path="/admin/settings/carousel"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          {/* <SidebarItem
            icon={<FiSettings />}
            label={isOpen ? "Account" : ""}
            isOpen={isOpen}
            path="/admin/settings/account"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          <SidebarItem
            icon={<FiKey />}
            label={isOpen ? "Access Control" : ""}
            isOpen={isOpen}
            path="/admin/settings/access-control"
            activePath={activePath}
            setActivePath={setActivePath}
          /> */}
          <SidebarItem
            icon={<FiShield />}
            label={isOpen ? "Security" : ""}
            isOpen={isOpen}
            path="/admin/settings/security"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          {/* <SidebarItem
            icon={<FiDatabase />}
            label={isOpen ? "Backup & Restore" : ""}
            isOpen={isOpen}
            path="/admin/settings/backup-restore"
            activePath={activePath}
            setActivePath={setActivePath}
          /> */}
          {/* <SidebarItem
            icon={<BiHistory />}
            label={isOpen ? "History Log" : ""}
            isOpen={isOpen}
            path="/admin/settings/history-log"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          <SidebarItem
            icon={<FiBell />}
            label={isOpen ? "Notifications" : ""}
            isOpen={isOpen}
            path="/admin/settings/notifications"
            activePath={activePath}
            setActivePath={setActivePath}
          /> */}
          <SidebarItem
            icon={<FiInfo />}
            label={isOpen ? "About Us" : ""}
            isOpen={isOpen}
            path="/admin/settings/aboutUsEdit"
            activePath={activePath}
            setActivePath={setActivePath}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsSubmenu;
