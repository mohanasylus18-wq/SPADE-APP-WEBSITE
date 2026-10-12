import React, { useState, useMemo } from "react";
import { Report, Screen, Category } from "../types";
import { ReportRow } from "../components/ReportRow";
import { Icon } from "../components/Icon";
import { TRUSTED_CONTRIBUTORS } from "../data/initialReports";

interface DashboardViewProps {
  reports: Report[];
  savedIds: string[];
  onNavigate: (screen: Screen) => void;
  onOpenDetails: (report: Report) => void;
  onToggleSave: (id: string) => void;
  locationOn: boolean;
  setLocationOn: (on: boolean) => void;
  selectedLocation: string;
}

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Transport & Roads",
  "Water & Sanitation",
  "Public Safety",
  "Environment & Waste",
  "Community Events",
  "Education",
  "Health",
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  savedIds,
  onNavigate,
  onOpenDetails,
  onToggleSave,
  locationOn,
  setLocationOn,
  selectedLocation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");
  const [feedFilter, setFeedFilter] = useState<"all" | "nearby" | "discussed" | "verified">("all");
  const [localSearch, setLocalSearch] = useState("");

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Category filter
      if (selectedCategory !== "All" && r.category !== selectedCategory) return false;

      // Location filter from topbar if not "All"
      if (
        selectedLocation !== "All Tamil Nadu (North Chennai)" &&
        !r.location.toLowerCase().includes(selectedLocation.split(",")[0].toLowerCase())
      ) {
        // loose match
      }

      // Quick tab filter
      if (feedFilter === "verified" && !r.verified) return false;
      if (feedFilter === "nearby" && !locationOn && !r.neighborhood?.includes("Avadi")) return false;
      if (feedFilter === "discussed" && (r.commentsCount || r.comments?.length || 0) < 10) return false;

      // Local search query
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        const matchesLoc = r.location.toLowerCase().includes(q);
        const matchesCat = r.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) return false;
      }

      return true;
    });
  }, [reports, selectedCategory, feedFilter, localSearch, selectedLocation, locationOn]);

  // Derived real metrics from application state (NO FAKE STATS)
  const totalCount = reports.length;
  const verifiedCount = reports.filter((r) => r.verified).length;
  const openIssuesCount = reports.filter((r) => r.status === "Open issue").length;
  const savedCount = savedIds.length;

  // Single featured story
  const featuredReport = reports.find((r) => r.urgency === "Urgent" || r.type === "Live") || reports[0];

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* 1. Newsroom Welcome Hero */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#172554] text-xs font-bold uppercase tracking-wider">
              <span className="font-serif text-sm">♠</span>
              SPADE CITIZEN NEWSROOM · TAMIL NADU
            </div>
            <h1 className="text-4xl sm:text-[44px] font-extrabold text-[#172554] tracking-tight leading-tight font-serif">
              Your Community, In Focus.
            </h1>
            <p className="text-base sm:text-lg text-[#525866] leading-relaxed">
              Local stories. Real voices. Public impact. A verified civic reporting platform connecting
              residents and community monitors across Avadi, Ambattur, and Poonamallee.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#feed"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("feed");
              }}
              className="px-5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#171717] hover:bg-[#EAF0FF]/60 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            >
              <Icon name="feed" size={18} className="text-[#3867F6]" />
              <span>Explore Reports</span>
            </a>
            <a
              href="#create"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("create");
              }}
              className="px-5 py-3 rounded-xl bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            >
              <Icon name="plus" size={18} />
              <span>Create Report</span>
            </a>
          </div>
        </div>

        {/* Small Stats Strip (Computed from actual application state) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-[#E5E7EB]">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866]">
              Community Reports
            </span>
            <div className="text-2xl font-black text-[#172554] font-serif">{totalCount}</div>
            <span className="text-xs text-[#525866]">In local database</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866]">
              Verified Stories
            </span>
            <div className="text-2xl font-black text-[#16845B] font-serif">{verifiedCount}</div>
            <span className="text-xs text-[#525866]">Corroborated by field</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866]">
              Open Civic Issues
            </span>
            <div className="text-2xl font-black text-[#F04452] font-serif">{openIssuesCount}</div>
            <span className="text-xs text-[#525866]">Pending municipal resolution</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866]">
              Saved by You
            </span>
            <div className="text-2xl font-black text-[#3867F6] font-serif">{savedCount}</div>
            <span className="text-xs text-[#525866]">Bookmarked dossiers</span>
          </div>
        </div>
      </section>

      {/* 2. One Featured Story (Card format) */}
      {featuredReport && (
        <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Featured Image */}
            {(featuredReport.media || featuredReport.image) && (
              <div
                onClick={() => onOpenDetails(featuredReport)}
                className="w-full lg:w-96 shrink-0 h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-900 cursor-pointer group relative border border-[#E5E7EB]"
              >
                <img
                  src={featuredReport.media || featuredReport.image}
                  alt={featuredReport.alt || featuredReport.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#FFF0F0] text-[#F04452] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F04452] animate-pulse" />
                    FEATURED STORY
                  </span>
                </div>
              </div>
            )}

            {/* Featured Body */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
                  {featuredReport.category}
                </span>

                {featuredReport.isDemo && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#EAF0FF] text-[#172554] border border-[#E5E7EB]">
                    Demo content
                  </span>
                )}

                <span className="text-[#525866] flex items-center gap-1 text-sm font-medium">
                  <Icon name="pin" size={14} className="text-[#F04452]" />
                  {featuredReport.location}
                </span>

                <span className="text-[#E5E7EB] hidden sm:inline">•</span>

                <span className="text-[#525866] text-sm flex items-center gap-1">
                  <Icon name="clock" size={13} />
                  {featuredReport.timeAgo || "Recently"}
                </span>
              </div>

              <h2
                onClick={() => onOpenDetails(featuredReport)}
                className="text-2xl sm:text-[26px] font-bold text-[#172554] hover:text-[#3867F6] cursor-pointer transition-colors leading-snug font-serif"
              >
                {featuredReport.title}
              </h2>

              <p className="text-base sm:text-[17px] text-[#525866] line-clamp-3 leading-relaxed">
                {featuredReport.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
                    {featuredReport.initials || featuredReport.author.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-[#171717]">{featuredReport.author}</span>
                  <span className="text-xs text-[#525866]">· {featuredReport.authorRole || "Civic Monitor"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSave(featuredReport.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                      savedIds.includes(featuredReport.id)
                        ? "bg-[#172554] text-white border-[#172554]"
                        : "bg-white text-[#525866] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                    }`}
                  >
                    <Icon
                      name={savedIds.includes(featuredReport.id) ? "bookmark-filled" : "bookmark"}
                      size={15}
                      className={savedIds.includes(featuredReport.id) ? "text-[#F5B942]" : ""}
                    />
                    <span>{savedIds.includes(featuredReport.id) ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={() => onOpenDetails(featuredReport)}
                    className="px-4 py-2 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
                  >
                    <span>Open Story</span>
                    <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Content Grid: Latest Reports Feed + Context Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Main Feed Column (8 cols): Compact list with rows separated by dividers */}
        <main className="lg:col-span-8 space-y-5">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#525866]">
                COMMUNITY DISPATCH STREAM
              </span>
              <h2 className="text-2xl font-bold text-[#172554] tracking-tight font-serif mt-0.5">
                Latest Community Reports
              </h2>
            </div>

            <a
              href="#feed"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("feed");
              }}
              className="text-sm font-bold text-[#3867F6] hover:underline flex items-center gap-1"
            >
              <span>View full feed</span>
              <Icon name="arrow" size={14} />
            </a>
          </div>

          {/* Feed Filter Controls */}
          <div className="space-y-3">
            {/* Category horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#3867F6] text-white shadow-xs"
                      : "bg-white text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sub-filters & Quick Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB]">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: "all", label: "All reports" },
                    { id: "nearby", label: "Nearby" },
                    { id: "discussed", label: "Most discussed" },
                    { id: "verified", label: "Verified only" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFeedFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      feedFilter === tab.id
                        ? "bg-[#EAF0FF] text-[#172554] font-bold"
                        : "text-[#525866] hover:text-[#171717]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full pl-8 pr-3 py-1 text-xs bg-[#FAFAF7] border border-[#E5E7EB] rounded-lg text-[#171717] focus:outline-hidden focus:ring-1 focus:ring-[#3867F6]"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#525866]">
                  <Icon name="search" size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* COMPACT LIST SEPARATED BY DIVIDERS (NOT a card per item) */}
          <div className="divide-y divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <ReportRow
                  key={report.id}
                  report={report}
                  isSaved={savedIds.includes(report.id)}
                  onOpenDetails={onOpenDetails}
                  onToggleSave={onToggleSave}
                />
              ))
            ) : (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center mx-auto">
                  <Icon name="search" size={24} />
                </div>
                <h3 className="text-base font-bold text-[#171717]">No reports matched your filters</h3>
                <p className="text-sm text-[#525866] max-w-sm mx-auto">
                  Try clearing your search terms or selecting &quot;All&quot; categories to see recent civic
                  dispatches.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setFeedFilter("all");
                    setLocalSearch("");
                  }}
                  className="px-4 py-2 bg-[#3867F6] text-white text-xs font-bold rounded-lg hover:bg-[#2753db] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href="#feed"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("feed");
              }}
              className="w-full py-3 bg-white border border-[#E5E7EB] hover:bg-[#EAF0FF]/60 text-[#172554] font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore All Community Stories in Local Feed</span>
              <Icon name="arrow" size={15} className="text-[#3867F6]" />
            </a>
          </div>
        </main>

        {/* Contextual Side Panel (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* 1. Around You Context Box */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#525866]">
                  LOCAL CONTEXT
                </span>
                <h3 className="text-lg font-bold text-[#172554] font-serif">Around You</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#EAF0FF] text-[#172554]">
                Avadi · Ambattur
              </span>
            </div>

            {/* Stylized Local Map Thumbnail */}
            <div
              onClick={() => onNavigate("nearby")}
              className="relative h-44 rounded-xl overflow-hidden border border-[#E5E7EB] bg-slate-900 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1499631507243-7290571550ed?auto=format&fit=crop&w=800&q=80"
                alt="Aerial view of Avadi and Ambattur residential blocks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Map pins */}
              <div className="absolute top-1/4 left-1/3 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#F04452] border-2 border-white animate-pulse" />
                <span className="text-[11px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  Avadi Depot
                </span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#3867F6] border-2 border-white" />
                <span className="text-[11px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  CTH Road
                </span>
              </div>

              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded backdrop-blur-xs">
                  <Icon name="map" size={13} />
                  <span>Avadi & Ambattur corridor</span>
                </span>
                <span className="font-bold text-[#F5B942] group-hover:underline">Open Map →</span>
              </div>
            </div>

            {/* Active Neighborhood Tally (Computed from reports) */}
            <div className="divide-y divide-[#E5E7EB] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#525866]">01</span>
                  <span className="font-bold text-[#171717]">Roads & Transit Infrastructure</span>
                </div>
                <span className="font-bold text-[#172554]">
                  {reports.filter((r) => r.category === "Transport & Roads").length} reports
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#525866]">02</span>
                  <span className="font-bold text-[#171717]">Water Mains & Sanitation</span>
                </div>
                <span className="font-bold text-[#172554]">
                  {reports.filter((r) => r.category === "Water & Sanitation").length} reports
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#525866]">03</span>
                  <span className="font-bold text-[#171717]">Public Safety & Streetlighting</span>
                </div>
                <span className="font-bold text-[#172554]">
                  {reports.filter((r) => r.category === "Public Safety").length} reports
                </span>
              </div>
            </div>

            {/* Location Sharing Switch */}
            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                  <Icon name="location" size={14} className="text-[#3867F6]" />
                  <span>Location context</span>
                </div>
                <div className="text-xs text-[#525866]">
                  {locationOn ? "Showing nearby reports first" : "Location sharing disabled"}
                </div>
              </div>

              <button
                onClick={() => setLocationOn(!locationOn)}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  locationOn ? "bg-[#172554]" : "bg-slate-300"
                }`}
                aria-label="Toggle location sharing"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    locationOn ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. Trusted Spaders / Community Trust */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#525866]">
                  COMMUNITY INTEGRITY
                </span>
                <h3 className="text-lg font-bold text-[#172554] font-serif">Trusted Spaders</h3>
              </div>
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("help");
                }}
                className="text-xs font-bold text-[#3867F6] hover:underline"
              >
                Standards
              </a>
            </div>

            <div className="space-y-2.5">
              {TRUSTED_CONTRIBUTORS.map((contributor) => (
                <div
                  key={contributor.name}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#FAFAF7] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {contributor.initials}
                    </span>
                    <div>
                      <div className="flex items-center gap-1 font-bold text-xs text-[#171717]">
                        <span>{contributor.name}</span>
                        <span className="text-[#16845B]">
                          <Icon name="badge" size={13} />
                        </span>
                      </div>
                      <div className="text-xs text-[#525866]">{contributor.beat}</div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#172554] bg-[#EAF0FF] px-2 py-0.5 rounded">
                    {contributor.trustScore}% trust
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Reporting Progress / Journalist Credential */}
          <div className="bg-[#172554] text-white rounded-2xl p-5 space-y-3.5 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5B942]">
                  YOUR CREDENTIAL PATH
                </span>
                <h3 className="text-base font-bold text-white font-serif mt-0.5">
                  Trust is built report by report.
                </h3>
              </div>
              <span className="font-serif text-2xl text-[#F5B942]">♠</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Higher publishing privileges are earned through responsible reporting, field
              corroboration, and a clean guideline record.
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">Reliable Contributor</span>
                <span className="text-[#F5B942]">78% to Journalist</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-[#F5B942] rounded-full w-[78%]" />
              </div>
            </div>

            <a
              href="#profile"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("profile");
              }}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-1"
            >
              <span>View Profile & Credentials</span>
              <Icon name="arrow" size={13} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
