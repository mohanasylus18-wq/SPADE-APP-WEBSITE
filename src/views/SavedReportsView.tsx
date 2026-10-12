import React, { useState } from "react";
import { Report, Screen } from "../types";
import { ReportRow } from "../components/ReportRow";
import { Icon } from "../components/Icon";

interface SavedReportsViewProps {
  reports: Report[];
  setScreen: (screen: Screen) => void;
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
}

export const SavedReportsView: React.FC<SavedReportsViewProps> = ({
  reports,
  setScreen,
  onOpenDetails,
  onToggleSave,
}) => {
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
              <Icon name="bookmark-filled" size={12} className="text-[#F5B942]" />
              SAVED ARTICLES & BOOKMARKS
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif">
              Saved Reports ({reports.length})
            </h1>
            <p className="text-base text-[#525866] max-w-xl">
              Civic stories, infrastructure complaints, and neighborhood alerts bookmarked for your
              follow-up.
            </p>
          </div>

          <button
            onClick={() => setScreen("feed")}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[#172554] hover:bg-[#EAF0FF]/60 text-sm font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Icon name="feed" size={16} className="text-[#3867F6]" />
            <span>Browse Local Feed</span>
          </button>
        </div>

        {/* Local Storage Notice */}
        <div className="mt-6 p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center gap-2.5 text-sm text-[#525866]">
          <Icon name="info" size={16} className="text-[#3867F6] shrink-0" />
          <span>
            <strong>Local Storage Notice:</strong> Saved reports are stored in your browser&apos;s
            localStorage only. They will persist across page refreshes on this device.
          </span>
        </div>
      </div>

      {/* Search inside saved */}
      {reports.length > 0 && (
        <div className="relative">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter through your saved reports..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#171717] placeholder-[#525866] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525866]">
            <Icon name="search" size={16} />
          </div>
        </div>
      )}

      {/* Reports List: Compact rows separated by dividers */}
      <div className="divide-y divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        {filtered.length > 0 ? (
          filtered.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              isSaved={true}
              onOpenDetails={onOpenDetails}
              onToggleSave={onToggleSave}
            />
          ))
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center mx-auto">
              <Icon name="bookmark" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">No saved reports found</h3>
            <p className="text-sm text-[#525866] max-w-md mx-auto leading-relaxed">
              {filterQuery
                ? "No bookmarks match your search query."
                : "You haven't bookmarked any reports yet. Tap the bookmark icon on any community report in the feed to save it for easy access."}
            </p>
            <button
              onClick={() => {
                setFilterQuery("");
                setScreen("feed");
              }}
              className="px-5 py-2.5 bg-[#3867F6] text-white text-xs font-bold rounded-xl hover:bg-[#2753db] transition-colors"
            >
              Browse Local Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
