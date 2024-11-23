'use client'

import { useState } from 'react';
import SidebarItem from '../navbar/SidebarItem';
import { BiArrowToBottom, BiChevronDown, BiChevronUp, BiUser, BiUserCheck, BiUserVoice } from 'react-icons/bi';

interface UserManagementSubmenuProps {
  isOpen: boolean;
  activePath: string;
  setActivePath: (path: string) => void;
}

const UserManagementSubmenu = ({ isOpen, activePath, setActivePath }: UserManagementSubmenuProps) => {
  const [isUserManagementOpen, setUserManagementOpen] = useState(false);

  return (
    <div>
      <SidebarItem
        icon={<BiUser />}
        label={isOpen ? "Users Management" : ""}
        isOpen={isOpen}
        path="#"
        activePath={activePath}
        setActivePath={() => setUserManagementOpen(!isUserManagementOpen)}
        >
        {isOpen && (isUserManagementOpen ? <BiChevronUp /> : <BiChevronDown />)}
      </SidebarItem>
      {isUserManagementOpen && (
        <div className="pl-6 space-y-2">
          <SidebarItem
            icon={<BiUserCheck />}
            label={isOpen ? "Lessor" : ""}
            isOpen={isOpen}
            path="/admin/user-management/lessors"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          <SidebarItem
            icon={<BiUserVoice />}
            label={isOpen ? "Lessee" : ""}
            isOpen={isOpen}
            path="/admin/user-management/lessees"
            activePath={activePath}
            setActivePath={setActivePath}
          />
        </div>
      )}
    </div>
  );
};

export default UserManagementSubmenu;
