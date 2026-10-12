import React, { useState, useRef, useEffect } from "react";
import { Screen, UserProfile, NotificationItem } from "../types";
import { Icon } from "./Icon";

interface TopbarProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  locationOn: boolean;
  setLocationOn: (on: boolean) => void;
  user: UserProfile;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Metrowater Team Deployed",
    message: "Emergency pipeline repair started near S.A. Engineering College, Poonamallee.",
    timeAgo: "15 min ago",
    read: false,
    type: "alert",
  },
  {
    id: "n2",
    title: "Official Ticket Logged",
    message: "Ambattur Corporation logged ticket #AMB-ELEC-442 for dark CTH Road stretch.",
    timeAgo: "2 hrs ago",
    read: false,
    type: "update",
  },
  {
    id: "n3",
    title: "Community Clean-up Verified",
    message: "Avadi Lake inlet channel desilting drive marked as verified by local monitors.",
    timeAgo: "Yesterday",
    read: true,
    type: "community",
  },
];

export const Topbar: React.FC<TopbarProps> = ({
  onNavigate,
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  locationOn,
  setLocationOn,
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
  triggerButtonRef,
}) => {
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const locRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const locations = [
    "All Tamil Nadu (North Chennai)",
    "Avadi, Tamil Nadu",
    "Ambattur, Chennai",
    "Poonamallee & S.A. College",
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle clicking outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger (<1024px) & Location Selector */}
      <div className="flex items-center gap-3">
        <button
          ref={triggerButtonRef}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#171717] hover:bg-[#EAF0FF] transition-colors focus-visible:ring-2 focus-visible:ring-[#3867F6]"
          aria-expanded={mobileMenuOpen}
          aria-controls="spade-sidebar"
          aria-label="Toggle navigation menu"
        >
          <Icon name="feed" size={22} />
        </button>

        {/* Location Selector Dropdown */}
        <div className="relative" ref={locRef}>
          <button
            onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#EAF0FF]/60 transition-colors text-left focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            aria-expanded={locationDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-[#EAF0FF] flex items-center justify-center text-[#172554] shrink-0">
              <Icon name="pin" size={16} className="text-[#F04452]" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#525866] block leading-tight">
                REPORTING BEAT
              </span>
              <span className="text-sm font-bold text-[#171717] flex items-center gap-1">
                {selectedLocation}
                <Icon name="chevron-down" size={12} className="text-[#525866]" />
              </span>
            </div>
          </button>

          {locationDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-2 z-30 animate-fade-in">
              <div className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-[#525866] border-b border-[#E5E7EB]">
                Filter by Region / Ward
              </div>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setLocationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between hover:bg-[#EAF0FF]/60 transition-colors ${
                    selectedLocation === loc
                      ? "text-[#172554] font-bold bg-[#EAF0FF]"
                      : "text-[#525866]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name="pin" size={14} className="text-[#F04452]" />
                    {loc}
                  </span>
                  {selectedLocation === loc && (
                    <Icon name="check" size={14} className="text-[#3867F6]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search reports input */}
      <div className="flex-1 max-w-lg hidden md:block">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports, topics, locations (e.g., Avadi, water, road)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-sm text-[#171717] placeholder-[#525866] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6] focus:bg-white transition-all"
            aria-label="Search reports"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525866]">
            <Icon name="search" size={16} />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525866] hover:text-[#171717] p-1"
              aria-label="Clear search"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Location Toggle */}
        <button
          onClick={() => setLocationOn(!locationOn)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all ${
            locationOn
              ? "bg-[#172554] text-white border-[#172554]"
              : "bg-white text-[#525866] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
          }`}
          title="Optional location sharing for nearby civic context"
          aria-pressed={locationOn}
        >
          <Icon name="location" size={15} className={locationOn ? "text-[#F5B942]" : ""} />
          <span className="hidden lg:inline">{locationOn ? "Location On" : "Location Off"}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-lg text-[#525866] hover:text-[#171717] hover:bg-[#EAF0FF]/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Icon name="bell" size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F04452] ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-30 animate-fade-in">
              <div className="px-4 py-3 bg-[#FAFAF7] border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#172554] uppercase tracking-wider">
                    Civic Dispatches & Alerts
                  </h4>
                  <span className="text-xs text-[#525866]">
                    {unreadCount} unread notifications
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-bold text-[#3867F6] hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E5E7EB]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-[#FAFAF7] transition-colors ${
                      !n.read ? "bg-[#EAF0FF]/40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-[#171717]">{n.title}</span>
                      <span className="text-xs text-[#525866] whitespace-nowrap">
                        {n.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs text-[#525866] mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#EAF0FF]/40 text-center border-t border-[#E5E7EB]">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onNavigate("live");
                  }}
                  className="text-xs font-bold text-[#172554] hover:text-[#3867F6]"
                >
                  View All Live Civic Dispatches →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Create Button */}
        <button
          onClick={() => onNavigate("create")}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-[#3867F6] hover:bg-[#2753db] text-white shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#3867F6]"
        >
          <Icon name="plus" size={16} />
          <span>Report Issue</span>
        </button>

        {/* User avatar shortcut to profile */}
        <button
          onClick={() => onNavigate("profile")}
          className="w-9 h-9 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#E5E7EB] hover:ring-[#3867F6] transition-all ml-1"
          aria-label="View user profile"
        >
          {user.initials}
        </button>
      </div>
    </header>
  );
};
