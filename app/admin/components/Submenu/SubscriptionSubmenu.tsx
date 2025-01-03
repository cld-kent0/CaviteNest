'use client'

import { useState } from 'react';
import SidebarItem from '../navbar/SidebarItem';
import { FiDollarSign } from 'react-icons/fi';
import { BiArchive, BiChevronDown, BiChevronUp, BiDetail, BiMoney, BiWallet } from 'react-icons/bi';

interface SubscriptionSubmenuProps {
  isOpen: boolean;
  activePath: string;
  setActivePath: (path: string) => void;
}

const SubscriptionSubmenu = ({ isOpen, activePath, setActivePath }: SubscriptionSubmenuProps) => {
  const [isSubscriptionOpen, setSubscriptionOpen] = useState(false);

  return (
    <div>
      <SidebarItem
        icon={<FiDollarSign />}
        label={isOpen ? "Subscription" : ""}
        isOpen={isOpen}
        path="#"
        activePath={activePath}
        setActivePath={() => setSubscriptionOpen(!isSubscriptionOpen)}
      >
        {isOpen && (isSubscriptionOpen ? <BiChevronUp /> : <BiChevronDown />)}
      </SidebarItem>
      {isSubscriptionOpen && (
        <div className="pl-6 space-y-2">
          <SidebarItem
            icon={<BiDetail />}
            label={isOpen ? "Subscription Details" : ""}
            isOpen={isOpen}
            path="/admin/subscription-management"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          <SidebarItem
            icon={<BiWallet />}
            label={isOpen ? "Payment Details" : ""}
            isOpen={isOpen}
            path="/admin/subscription-management/payment-details"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          <SidebarItem
            icon={<BiArchive />}
            label="Transaction History"
            isOpen={isOpen}
            path="/admin/subscription-management/transaction-history"
            activePath={activePath}
            setActivePath={setActivePath}
          />
          <SidebarItem
            icon={<FiDollarSign />}
            label="Subscription Plan"
            isOpen={isOpen}
            path="/admin/subscription-management/subscriptions-plan"
            activePath={activePath}
            setActivePath={setActivePath}
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionSubmenu;
