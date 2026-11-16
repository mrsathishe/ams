import { useState, useRef, useEffect } from "react";
import { Apartment, PendingApproval, User } from "../../../types";

interface HeaderRightProps {
  user: User | null;
  apartments: Apartment[];
  activeApartmentId: string | null;
  onSelectApartment: (id: string) => void;
  approvals: PendingApproval[];
  onOpenCommunity: () => void;
  onNavigateProfile: () => void;
  onLogout: () => void;
}

export default function HeaderRight({
  user,
  apartments,
  activeApartmentId,
  onSelectApartment,
  approvals,
  onOpenCommunity,
  onNavigateProfile,
  onLogout,
}: HeaderRightProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = approvals.length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Apartment Selector */}
      {/* apartments.length > 0 && (
        <div className="hidden sm:block">
          <label className="sr-only" htmlFor="activeApartment">
            Current apartment
          </label>
          <select
            id="activeApartment"
            value={activeApartmentId || ""}
            onChange={(e) => onSelectApartment(e.target.value)}
            className="max-w-[200px] rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.name || `Apartment ${apt.id.slice(-6)}`}
              </option>
            ))}
          </select>
        </div>
      ) */}

      {/* Notification Bell Icon with Badge */}
      <div className="relative" ref={notifRef}>
        <button
          type="button"
          onClick={() => setIsNotifOpen((prev) => !prev)}
          className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          aria-label="Notifications"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {isNotifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-md border border-gray-200 bg-white py-2 shadow-lg z-50">
            <div className="border-b border-gray-100 px-4 py-2">
              <p className="text-sm font-semibold text-gray-800">
                Notifications
              </p>
            </div>
            {unreadCount === 0 ? (
              <p className="px-4 py-4 text-center text-sm text-gray-500">
                No unread notifications
              </p>
            ) : (
              <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
                {approvals.map((item) => (
                  <li
                    key={item.id}
                    className="px-4 py-2.5 text-sm hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">
                      {item.name} ({item.relationship})
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.type.replace(/_/g, " ")} · {item.apartment_name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-2 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </span>
          <span className="hidden max-w-[120px] truncate sm:inline">
            {user?.name || "User"}
          </span>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50">
            <div className="border-b border-gray-100 px-4 py-2 sm:hidden">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                onNavigateProfile();
              }}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Profile settings
            </button>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                onOpenCommunity();
              }}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Community
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                onLogout();
              }}
              className="flex w-full items-center px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
