import React, { useState } from "react";
import { Report } from "../types";
import { ReportRow } from "../components/ReportRow";
import { Icon } from "../components/Icon";
import { useReports } from "../context/ReportsContext";

interface LiveReportsViewProps {
  reports: Report[];
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
  onAddUpdate: (reportId: string, text: string) => void;
}

export const LiveReportsView: React.FC<LiveReportsViewProps> = ({
  reports,
  onOpenDetails,
  onToggleSave,
  onAddUpdate,
}) => {
  const { savedIds } = useReports();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");
  const [selectedLiveReportId, setSelectedLiveReportId] = useState<string | null>(null);
  const [witnessText, setWitnessText] = useState("");
  const [witnessRole, setWitnessRole] = useState("Eyewitness on site");
  const [witnessSuccess, setWitnessSuccess] = useState(false);

  // Live or urgent reports
  const liveReports = reports.filter(
    (r) => r.type === "Live" || r.status === "Live coverage" || r.urgency === "Urgent"
  );

  const activeLiveReport =
    liveReports.find((r) => r.id === selectedLiveReportId) || liveReports[0] || reports[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 600);
  };

  const handleWitnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!witnessText.trim() || !activeLiveReport) return;

    const formatted = `${witnessRole}: ${witnessText.trim()}`;
    onAddUpdate(activeLiveReport.id, formatted);
    setWitnessText("");
    setWitnessSuccess(true);
    setTimeout(() => setWitnessSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-[#FFF0F0] text-[#F04452]">
              <span className="w-2 h-2 rounded-full bg-[#F04452] animate-ping" />
              LIVE CIVIC DISPATCH ROOM
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif">
              Live Reports & Field Feeds
            </h1>
            <p className="text-base text-[#525866] max-w-xl">
              Real-time monitoring of breaking civic incidents, infrastructure repairs, and emergency
              traffic diversions in Chennai western zones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-[#525866]">
              <span>Last sync: </span>
              <strong className="text-[#171717]">{lastSyncTime}</strong>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-[#3867F6] hover:bg-[#2753db] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            >
              <Icon
                name="refresh"
                size={14}
                className={isRefreshing ? "animate-spin text-white" : ""}
              />
              <span>{isRefreshing ? "Syncing..." : "Refresh Feed"}</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Notice required by global rules */}
        <div className="mt-6 p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center gap-3 text-sm text-[#525866]">
          <Icon name="info" size={17} className="text-[#3867F6] shrink-0" />
          <span>
            <strong>Simulated Live Field Feed:</strong> Incidents represent citizen field monitoring in
            Avadi and Poonamallee. All dispatches are persisted locally in browser storage.
          </span>
        </div>
      </div>

      {/* Main Live Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Live Incident Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F04452] animate-ping" />
              <h2 className="text-base font-bold text-[#172554]">
                Active Incident Timeline: #{activeLiveReport.id}
              </h2>
            </div>
            <span className="text-xs font-bold text-[#F04452] bg-[#FFF0F0] px-2.5 py-0.5 rounded border border-[#F04452]/20">
              Live Coverage
            </span>
          </div>

          {/* Headline & Location */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#172554] font-serif leading-snug">
              {activeLiveReport.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-[#525866]">
              <Icon name="pin" size={14} className="text-[#F04452]" />
              <span className="font-semibold text-[#171717]">{activeLiveReport.location}</span>
              <span>•</span>
              <span>Reported by {activeLiveReport.author}</span>
            </div>
          </div>

          {/* Media thumbnail */}
          {(activeLiveReport.media || activeLiveReport.image) && (
            <div className="rounded-xl overflow-hidden border border-[#E5E7EB] max-h-64 bg-slate-900">
              <img
                src={activeLiveReport.media || activeLiveReport.image}
                alt={activeLiveReport.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Chronological Timeline Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#525866]">
              Chronological Field Dispatches
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-[#E5E7EB]">
              {activeLiveReport.updates?.map((upd, idx) => (
                <div key={idx} className="relative pl-8 text-sm">
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#F04452] border-2 border-white ring-2 ring-[#F04452]/20 -translate-x-1/2" />
                  <span className="font-mono text-xs font-bold text-[#F04452] block">
                    {upd.time}
                  </span>
                  <p className="text-[#171717] mt-0.5 leading-relaxed">{upd.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Witness Check-in Form */}
          <form
            onSubmit={handleWitnessSubmit}
            className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
                <Icon name="radio" size={15} className="text-[#F04452]" />
                Are you on site? Submit a Witness Check-in
              </span>
              <select
                value={witnessRole}
                onChange={(e) => setWitnessRole(e.target.value)}
                className="text-xs px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#171717]"
              >
                <option value="Eyewitness on site">Eyewitness on site</option>
                <option value="Commuter nearby">Commuter nearby</option>
                <option value="Local resident">Local resident</option>
              </select>
            </div>

            <textarea
              rows={2}
              value={witnessText}
              onChange={(e) => setWitnessText(e.target.value)}
              placeholder="E.g., Repair vehicle just arrived; single lane reopened for buses..."
              className="w-full p-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#171717] focus:outline-hidden focus:ring-1 focus:ring-[#3867F6]"
            />

            {witnessSuccess && (
              <p className="text-xs text-[#16845B] font-bold flex items-center gap-1">
                <Icon name="check-circle" size={13} /> Field update posted to timeline!
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!witnessText.trim()}
                className="px-4 py-1.5 bg-[#F04452] hover:bg-[#d6303e] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Post Live Update
              </button>
            </div>
          </form>
        </div>

        {/* Live Incident Selector List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#525866] mb-3">
              All Active Incidents ({liveReports.length})
            </h3>
            <div className="space-y-2.5">
              {liveReports.map((r) => {
                const isSelected = (activeLiveReport?.id || liveReports[0]?.id) === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedLiveReportId(r.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#EAF0FF] border-[#3867F6] shadow-xs"
                        : "bg-white border-[#E5E7EB] hover:border-[#3867F6]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#F04452] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F04452] animate-pulse" />
                        {r.type === "Live" ? "LIVE COVERAGE" : "HIGH PRIORITY"}
                      </span>
                      <span className="text-[#525866] text-xs">{r.timeAgo || "Recently"}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#172554] font-serif line-clamp-1">
                      {r.title}
                    </h4>
                    <p className="text-sm text-[#525866] line-clamp-1 mt-0.5">{r.location}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected report full card */}
          {activeLiveReport && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
              <ReportRow
                report={activeLiveReport}
                isSaved={savedIds.includes(activeLiveReport.id)}
                onOpenDetails={onOpenDetails}
                onToggleSave={onToggleSave}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
