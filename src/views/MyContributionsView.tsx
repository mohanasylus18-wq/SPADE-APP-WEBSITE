import React, { useState } from "react";
import { Report, Screen } from "../types";
import { ReportRow } from "../components/ReportRow";
import { Icon } from "../components/Icon";
import { useReports } from "../context/ReportsContext";

interface MyContributionsViewProps {
  reports: Report[];
  setScreen: (screen: Screen) => void;
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
  onDeleteReport: (id: string) => void;
}

export const MyContributionsView: React.FC<MyContributionsViewProps> = ({
  reports,
  setScreen,
  onOpenDetails,
  onToggleSave,
  onDeleteReport,
}) => {
  const { savedIds } = useReports();
  const [filter, setFilter] = useState<"all" | "review" | "verified">("all");

  const myReports = reports.filter((r) => r.isUserSubmitted || r.author === "Amara King");

  const filtered = myReports.filter((r) => {
    if (filter === "review") return r.status === "Under review";
    if (filter === "verified") return r.verified || r.status === "Verified";
    return true;
  });

  const underReviewCount = myReports.filter((r) => r.status === "Under review").length;
  const verifiedCount = myReports.filter((r) => r.verified || r.status === "Verified").length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
              <Icon name="file" size={13} />
              YOUR CIVIC JOURNALISM DOSSIER
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif">
              My Contributions ({myReports.length})
            </h1>
            <p className="text-base text-[#525866] max-w-xl">
              Track the review status, community corroborations, and municipal escalation of your
              submitted reports.
            </p>
          </div>

          <button
            onClick={() => setScreen("create")}
            className="px-5 py-2.5 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
          >
            <Icon name="plus" size={16} />
            <span>File New Report</span>
          </button>
        </div>

        {/* Real Summary Metrics */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E5E7EB]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866] block">
              Total Filed
            </span>
            <span className="text-2xl font-black text-[#172554] font-serif">{myReports.length}</span>
            <span className="text-xs text-[#525866] block mt-0.5">In local session</span>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172554] block">
              Under Review
            </span>
            <span className="text-2xl font-black text-[#172554] font-serif">{underReviewCount}</span>
            <span className="text-xs text-[#525866] block mt-0.5">Pending corroboration</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16845B] block">
              Verified & Published
            </span>
            <span className="text-2xl font-black text-[#16845B] font-serif">{verifiedCount}</span>
            <span className="text-xs text-[#525866] block mt-0.5">Public interest impact</span>
          </div>
        </div>

        {/* Local Storage Disclaimer required by brief */}
        <div className="mt-6 p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center gap-2.5 text-sm text-[#525866]">
          <Icon name="shield" size={16} className="text-[#172554] shrink-0" />
          <span>
            <strong>Browser Storage Disclaimer:</strong> Your contributions are saved to this browser&apos;s
            localStorage only. Local browser storage is device-specific and does not synchronize across
            different machines.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
            filter === "all"
              ? "bg-[#3867F6] text-white shadow-xs"
              : "bg-white text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
          }`}
        >
          All Contributions ({myReports.length})
        </button>
        <button
          onClick={() => setFilter("review")}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
            filter === "review"
              ? "bg-[#3867F6] text-white shadow-xs"
              : "bg-white text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
          }`}
        >
          Under Review ({underReviewCount})
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
            filter === "verified"
              ? "bg-[#3867F6] text-white shadow-xs"
              : "bg-white text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
          }`}
        >
          Verified ({verifiedCount})
        </button>
      </div>

      {/* List of user reports: Compact rows separated by dividers */}
      <div className="divide-y divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        {filtered.length > 0 ? (
          filtered.map((report) => (
            <div key={report.id} className="relative group">
              <ReportRow
                report={report}
                isSaved={savedIds.includes(report.id)}
                onOpenDetails={onOpenDetails}
                onToggleSave={onToggleSave}
              />
              <div className="py-2 px-6 bg-[#FAFAF7] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#525866]">
                <span className="flex items-center gap-1 font-medium">
                  <Icon name="info" size={13} className="text-[#3867F6]" />
                  Status: <strong className="text-[#171717]">{report.status}</strong>
                </span>

                <button
                  onClick={() => {
                    if (window.confirm(`Withdraw and delete report ${report.id}?`)) {
                      onDeleteReport(report.id);
                    }
                  }}
                  className="text-[#F04452] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="trash" size={13} />
                  <span>Withdraw Report</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center mx-auto">
              <Icon name="file" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">No contributions found</h3>
            <p className="text-sm text-[#525866] max-w-md mx-auto">
              You haven&apos;t filed any civic reports in this category yet. Your firsthand reports help
              improve civic responsiveness in your neighborhood.
            </p>
            <button
              onClick={() => setScreen("create")}
              className="px-5 py-2.5 bg-[#3867F6] text-white text-xs font-bold rounded-xl hover:bg-[#2753db] transition-colors cursor-pointer"
            >
              Report an Issue Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
