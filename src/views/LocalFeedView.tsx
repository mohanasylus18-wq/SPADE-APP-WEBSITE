import React, { useState, useMemo } from "react";
import { Report, Category } from "../types";
import { ReportRow } from "../components/ReportRow";
import { Icon } from "../components/Icon";
import { useReports } from "../context/ReportsContext";

interface LocalFeedViewProps {
  reports: Report[];
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
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

const NEIGHBORHOODS = ["All Zones", "Avadi", "Ambattur", "Poonamallee"];

export const LocalFeedView: React.FC<LocalFeedViewProps> = ({
  reports,
  onOpenDetails,
  onToggleSave,
  onShare,
  searchQuery,
  setSearchQuery,
}) => {
  const { savedIds } = useReports();
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [sortBy, setSortBy] = useState<"newest" | "discussed" | "verified" | "urgent">("newest");

  const filteredReports = useMemo(() => {
    let list = [...reports];

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter((r) => r.category === selectedCategory);
    }

    // Neighborhood filter
    if (selectedZone !== "All Zones") {
      list = list.filter(
        (r) =>
          r.neighborhood?.toLowerCase().includes(selectedZone.toLowerCase()) ||
          r.location.toLowerCase().includes(selectedZone.toLowerCase())
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
      );
    }

    // Sort order
    switch (sortBy) {
      case "discussed":
        list.sort(
          (a, b) => (b.commentsCount || b.comments?.length || 0) - (a.commentsCount || a.comments?.length || 0)
        );
        break;
      case "verified":
        list.sort((a, b) => (b.verified === a.verified ? 0 : b.verified ? 1 : -1));
        break;
      case "urgent":
        list.sort((a, b) => (b.urgency === "Urgent" ? 1 : 0) - (a.urgency === "Urgent" ? 1 : 0));
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  }, [reports, selectedCategory, selectedZone, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Feed Page Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
              CHRONOLOGICAL COMMUNITY BEAT
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif mt-2">
              Local Feed & Public Affairs
            </h1>
            <p className="text-base text-[#525866] mt-1">
              Field observations, civic complaints, and verified developments across Chennai western suburbs.
            </p>
          </div>

          <div className="text-right sm:text-left shrink-0">
            <span className="text-xs font-bold text-[#525866] block uppercase tracking-wider">
              Dispatches Found
            </span>
            <span className="text-2xl font-black text-[#172554] font-serif">
              {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"}
            </span>
          </div>
        </div>

        {/* Search Bar inside Feed */}
        <div className="mt-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within feed by issue, street, contributor, or topic..."
            className="w-full pl-11 pr-4 py-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-sm text-[#171717] placeholder-[#525866] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525866]">
            <Icon name="search" size={18} />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#525866] hover:text-[#171717] bg-[#EAF0FF] px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Category Filter Chips */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#525866] block mb-2">
            Filter by Topic
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#3867F6] text-white shadow-xs"
                    : "bg-[#FAFAF7] text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhood Pills & Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E5E7EB]">
          {/* Neighborhood */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#525866] mr-1 flex items-center gap-1">
              <Icon name="pin" size={13} className="text-[#F04452]" />
              Zone:
            </span>
            {NEIGHBORHOODS.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedZone === zone
                    ? "bg-[#EAF0FF] text-[#172554] font-bold"
                    : "text-[#525866] hover:text-[#171717] hover:bg-[#EAF0FF]/60"
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#525866]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#FAFAF7] border border-[#E5E7EB] text-[#171717] focus:outline-hidden focus:ring-1 focus:ring-[#3867F6]"
            >
              <option value="newest">Newest First</option>
              <option value="discussed">Most Discussed</option>
              <option value="verified">Verified First</option>
              <option value="urgent">Highest Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Feed List: Compact rows separated by dividers */}
      <div className="divide-y divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              isSaved={savedIds.includes(report.id)}
              onOpenDetails={onOpenDetails}
              onToggleSave={onToggleSave}
              onShare={onShare}
            />
          ))
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center mx-auto">
              <Icon name="search" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">No reports found</h3>
            <p className="text-sm text-[#525866] max-w-md mx-auto">
              We couldn&apos;t find any civic reports matching your current search or category selections.
              Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedZone("All Zones");
                setSearchQuery("");
                setSortBy("newest");
              }}
              className="px-5 py-2.5 bg-[#3867F6] text-white text-xs font-bold rounded-xl hover:bg-[#2753db] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
