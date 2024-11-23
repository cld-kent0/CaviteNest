'use client'

import { useState } from 'react';
import SidebarItem from '../navbar/SidebarItem';
import { BiArrowToBottom, BiBuildingHouse, BiChevronDown, BiChevronUp, BiDetail, BiHome, BiUser, BiUserCheck, BiUserVoice } from 'react-icons/bi';

interface PropertyListingsSubmenu {
  isOpen: boolean;
  activePath: string;
  setActivePath: (path: string) => void;
}

const PropertyListingsSubmenu = ({ isOpen, activePath, setActivePath }: PropertyListingsSubmenu) => {
  const [isPropertyListingsOpen, setPropertyListingsOpen] = useState(false);

  return (
    <div>
      <SidebarItem
        icon={<BiBuildingHouse />}
        label={isOpen ? "Property Listings" : ""}
        isOpen={isOpen}
        path="#"
        activePath={activePath}
        setActivePath={() => setPropertyListingsOpen(!isPropertyListingsOpen)}
        >
        {isOpen && (isPropertyListingsOpen ? <BiChevronUp /> : <BiChevronDown />)}
      </SidebarItem>
      {isPropertyListingsOpen && (
        <div className="pl-6 space-y-2">
          <SidebarItem
            icon={<BiDetail />}
            label={isOpen ? "Property Details" : ""}
            isOpen={isOpen}
            path="/admin/property-listings/property-details"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          {/* <SidebarItem
            icon={<BiUserVoice />}
            label={isOpen ? "future purposes" : ""}
            isOpen={isOpen}
            path="/admin/property-lisitngs/lessees"
            activePath={activePath}
            setActivePath={setActivePath}
          /> */}
        </div>
      )}
    </div>
  );
};

export default PropertyListingsSubmenu;
