import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import { Apartment, PendingApproval, User } from "../../types";

interface HeaderProps {
  user: User | null;
  apartments: Apartment[];
  activeApartmentId: string | null;
  onSelectApartment: (id: string) => void;
  approvals: PendingApproval[];
  onToggleMobileSidebar: () => void;
  onOpenCommunity: () => void;
  onNavigateProfile: () => void;
  onLogout: () => void;
}

export default function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <HeaderLeft onToggleMobileSidebar={props.onToggleMobileSidebar} />
        <HeaderRight {...props} />
      </div>
    </header>
  );
}
