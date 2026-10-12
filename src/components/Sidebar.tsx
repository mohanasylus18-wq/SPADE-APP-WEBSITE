import React, { useEffect, useRef } from "react";
import { Screen, UserProfile } from "../types";
import { Icon, IconName } from "./Icon";

interface SidebarProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  savedCount: number;
  contributionsCount: number;
  user: UserProfile;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

interface NavItemConfig {
  id: Screen;
  label: string;
  icon: IconName;
  badge?: number | string;
  isLive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  screen,
  onNavigate,
  savedCount,
  contributionsCount,
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
  triggerButtonRef,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);

  const primaryNavItems: NavItemConfig[] = [
    { id: "home", label: "Home", icon: "home" },
    { id: "feed", label: "Local Feed", icon: "feed" },
    { id: "nearby", label: "Explore Nearby", icon: "pin" },
    { id: "create", label: "Report an Issue", icon: "plus" },
    { id: "live", label: "Live Reports", icon: "radio", isLive: true },
    { id: "saved", label: "Saved Reports", icon: "bookmark", badge: savedCount },
    { id: "contributions", label: "My Contributions", icon: "file", badge: contributionsCount },
  ];

  const secondaryNavItems: NavItemConfig[] = [
    { id: "profile", label: "Journalist Profile", icon: "user" },
    { id: "help", label: "Help & Guidelines", icon: "help" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  // Accessible Escape key and Focus Trap when mobile drawer is open below 1024px
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        triggerButtonRef?.current?.focus();
        return;
      }

      // Focus trap within sidebar
      if (e.key === "Tab" && sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, setMobileMenuOpen, triggerButtonRef]);

  const handleLinkClick = (e: React.MouseEvent, id: Screen) => {
    e.preventDefault();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sidebar: Fixed on desktop (>=1024px), drawer below 1024px */}
      <aside
        id="spade-sidebar"
        ref={sidebarRef}
        role={mobileMenuOpen ? "dialog" : undefined}
        aria-modal={mobileMenuOpen ? "true" : undefined}
        aria-label="Main Navigation"
        className={`fixed inset-y-0 left-0 z-40 w-68 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-[#E5E7EB]">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, "home")}
              className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3867F6] rounded-lg p-1"
              aria-label="SPADE Home"
            >
              <span className="w-10 h-10 rounded-xl bg-[#172554] text-white flex items-center justify-center font-serif text-2xl group-hover:bg-[#3867F6] transition-colors shadow-xs">
                ♠
              </span>
              <div>
                <span className="text-xl font-black tracking-wider text-[#172554] block leading-none font-serif">
                  SPADE
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#F04452] mt-1 block">
                  Citizen Journalism
                </span>
              </div>
            </a>

            {/* Mobile close button (<1024px) */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerButtonRef?.current?.focus();
              }}
              className="lg:hidden p-2 rounded-lg text-[#525866] hover:bg-[#EAF0FF] hover:text-[#172554] transition-colors focus-visible:ring-2 focus-visible:ring-[#3867F6]"
              aria-label="Close navigation menu"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Primary Navigation List */}
          <div className="px-3.5 py-4">
            <div className="px-3 mb-2 text-[12px] font-bold uppercase tracking-wider text-[#525866]">
              Community Desk
            </div>
            <nav className="space-y-1" aria-label="Primary">
              {primaryNavItems.map((item) => {
                const isActive = screen === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[16px] font-semibold transition-all relative ${
                      isActive
                        ? "bg-[#3867F6] text-white font-bold shadow-xs"
                        : "text-[#525866] hover:text-[#171717] hover:bg-[#EAF0FF]/60"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      className={isActive ? "text-white" : "text-[#525866]"}
                    />
                    <span className="truncate">{item.label}</span>

                    {/* Live indicator dot */}
                    {item.isLive && (
                      <span className="ml-auto flex h-2 w-2 relative" title="Live reports feed">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F04452] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F04452]"></span>
                      </span>
                    )}

                    {/* Counter badges */}
                    {typeof item.badge === "number" && item.badge > 0 && (
                      <span
                        className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#EAF0FF] text-[#172554]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Secondary Navigation List */}
          <div className="px-3.5 pt-2">
            <div className="px-3 mb-2 text-[12px] font-bold uppercase tracking-wider text-[#525866]">
              Editorial & Account
            </div>
            <nav className="space-y-1" aria-label="Account">
              {secondaryNavItems.map((item) => {
                const isActive = screen === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-lg text-[16px] font-semibold transition-colors ${
                      isActive
                        ? "bg-[#3867F6] text-white font-bold"
                        : "text-[#525866] hover:text-[#171717] hover:bg-[#EAF0FF]/60"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      name={item.icon}
                      size={19}
                      className={isActive ? "text-white" : "text-[#525866]"}
                    />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFAF7]">
          <a
            href="#profile"
            onClick={(e) => handleLinkClick(e, "profile")}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-[#E5E7EB]"
            aria-label="View Amara King's journalist profile"
          >
            <div className="relative">
              <span className="w-10 h-10 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-xs">
                {user.initials}
              </span>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#16845B] rounded-full border-2 border-white"
                title="Active reporter"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-[#171717] block truncate">
                {user.name}
              </span>
              <span className="text-xs text-[#525866] flex items-center gap-1 truncate">
                <span className="text-[#172554] font-serif">♠</span> {user.badgeLevel}
              </span>
            </div>
            <Icon name="chevron" size={15} className="text-[#525866] shrink-0" />
          </a>
        </div>
      </aside>

      {/* Accessible Backdrop below 1024px */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#172554]/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => {
            setMobileMenuOpen(false);
            triggerButtonRef?.current?.focus();
          }}
          aria-hidden="true"
        />
      )}

      {/* Bottom Bar below 768px for Quick Navigation */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#E5E7EB] md:hidden px-3 py-1.5 flex items-center justify-around shadow-lg">
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, "home")}
          className={`flex flex-col items-center p-1.5 text-xs font-semibold ${
            screen === "home" ? "text-[#3867F6] font-bold" : "text-[#525866]"
          }`}
        >
          <Icon name="home" size={20} />
          <span className="text-[11px] mt-0.5">Home</span>
        </a>

        <a
          href="#feed"
          onClick={(e) => handleLinkClick(e, "feed")}
          className={`flex flex-col items-center p-1.5 text-xs font-semibold ${
            screen === "feed" ? "text-[#3867F6] font-bold" : "text-[#525866]"
          }`}
        >
          <Icon name="feed" size={20} />
          <span className="text-[11px] mt-0.5">Feed</span>
        </a>

        <a
          href="#create"
          onClick={(e) => handleLinkClick(e, "create")}
          className="flex flex-col items-center -mt-4 bg-[#F04452] text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-[#d6303e] transition-colors"
          aria-label="Create new report"
        >
          <Icon name="plus" size={22} />
        </a>

        <a
          href="#live"
          onClick={(e) => handleLinkClick(e, "live")}
          className={`flex flex-col items-center p-1.5 text-xs font-semibold relative ${
            screen === "live" ? "text-[#F04452] font-bold" : "text-[#525866]"
          }`}
        >
          <Icon name="radio" size={20} />
          <span className="text-[11px] mt-0.5">Live</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#F04452] animate-ping" />
        </a>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center p-1.5 text-xs font-semibold text-[#525866]"
          aria-label="Open full menu"
        >
          <Icon name="more" size={20} />
          <span className="text-[11px] mt-0.5">Menu</span>
        </button>
      </div>
    </>
  );
};
