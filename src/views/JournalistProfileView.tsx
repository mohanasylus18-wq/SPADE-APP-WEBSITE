import React from "react";
import { Report, Screen, UserProfile } from "../types";
import { ReportRow } from "../components/ReportRow";
import { Icon } from "../components/Icon";
import { useReports } from "../context/ReportsContext";

interface JournalistProfileViewProps {
  user: UserProfile;
  reports: Report[];
  setScreen: (screen: Screen) => void;
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
}

export const JournalistProfileView: React.FC<JournalistProfileViewProps> = ({
  user,
  reports,
  setScreen,
  onOpenDetails,
  onToggleSave,
}) => {
  const { savedIds } = useReports();
  const userReports = reports.filter((r) => r.isUserSubmitted || r.author === user.name);
  const verifiedCount = userReports.filter((r) => r.verified || r.status === "Verified").length;
  const totalLikes = userReports.reduce((acc, r) => acc + (r.likes || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Profile Banner Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-9 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with Credential Badge */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-[#172554] text-white flex items-center justify-center font-bold text-2xl font-serif shadow-md border-2 border-white">
              {user.initials}
            </div>
            <div
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#F5B942] text-[#171717] flex items-center justify-center font-serif text-lg font-bold shadow-md border-2 border-white"
              title="SPADE Contributor Badge"
            >
              ♠
            </div>
          </div>

          {/* Profile Bio & Title */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
                COMMUNITY JOURNALIST
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#FAFAF7] text-[#172554] border border-[#E5E7EB]">
                {user.location}
              </span>
              <span className="text-xs text-[#525866] ml-auto font-medium">
                Active member since {user.joinedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] font-serif">
              {user.name}
            </h1>
            <p className="text-base text-[#525866] leading-relaxed max-w-2xl">{user.bio}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-[#525866]">
              <span className="flex items-center gap-1.5 font-medium">
                <Icon name="shield-check" size={15} className="text-[#16845B]" />
                Trust Rating: <strong className="text-[#171717]">{user.trustScore}%</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Icon name="map" size={15} className="text-[#3867F6]" />
                Primary Beat: Municipal Infrastructure & Transit
              </span>
            </div>
          </div>

          <button
            onClick={() => setScreen("settings")}
            className="px-4 py-2.5 bg-[#FAFAF7] hover:bg-[#EAF0FF]/60 border border-[#E5E7EB] text-sm font-bold text-[#171717] rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Icon name="settings" size={15} />
            <span>Settings</span>
          </button>
        </div>

        {/* Dynamic App-Computed Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#E5E7EB]">
          <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E5E7EB]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866] block">
              Reports Filed
            </span>
            <span className="text-2xl font-black text-[#172554] font-serif">{userReports.length}</span>
            <span className="text-xs text-[#525866] block mt-0.5">Live in this app state</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16845B] block">
              Verified Stories
            </span>
            <span className="text-2xl font-black text-[#16845B] font-serif">{verifiedCount}</span>
            <span className="text-xs text-[#525866] block mt-0.5">Corroborated by field</span>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
              Helpful Marks
            </span>
            <span className="text-2xl font-black text-rose-950 font-serif">{totalLikes}</span>
            <span className="text-xs text-[#525866] block mt-0.5">Community votes</span>
          </div>

          <div className="p-3.5 bg-[#EAF0FF] rounded-xl border border-[#3867F6]/20">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172554] block">
              Credential Level
            </span>
            <span className="text-lg font-black text-[#172554] font-serif mt-1 block">
              Reliable Contributor
            </span>
            <span className="text-xs text-[#3867F6] block font-semibold">78% to SPADE Journalist</span>
          </div>
        </div>
      </div>

      {/* Credential Progression Path */}
      <div className="bg-[#172554] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5B942]">
              <span className="font-serif text-base">♠</span>
              JOURNALIST CREDENTIAL CRITERIA
            </div>
            <h2 className="text-2xl font-bold font-serif text-white">
              Road to &quot;SPADE Journalist&quot; Status
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Higher publishing privileges allow direct civic escalation and publication of urgent
              field dispatches without prior queue holding.
            </p>
          </div>

          <div className="text-right sm:text-left shrink-0">
            <span className="text-3xl font-black text-[#F5B942] font-serif">78%</span>
            <span className="text-xs text-slate-300 block">Overall progression</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F5B942] to-amber-300 rounded-full w-[78%]" />
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center gap-3">
            <Icon name="check-circle" size={18} className="text-emerald-400 shrink-0" />
            <div className="text-sm">
              <strong className="text-white block">File 5+ Firsthand Reports</strong>
              <span className="text-slate-300">
                Completed ({userReports.length} reports submitted)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center gap-3">
            <Icon name="check-circle" size={18} className="text-emerald-400 shrink-0" />
            <div className="text-sm">
              <strong className="text-white block">Maintain &gt;90% Fact-Check Accuracy</strong>
              <span className="text-slate-300">Completed (96% current trust score)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center gap-3">
            <Icon name="check-circle" size={18} className="text-emerald-400 shrink-0" />
            <div className="text-sm">
              <strong className="text-white block">Active in Beat for 6+ Months</strong>
              <span className="text-slate-300">Completed (11 months active)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-[#F5B942] shrink-0" />
            <div className="text-sm">
              <strong className="text-white block">Pass Civic Verification Ethics Module</strong>
              <span className="text-amber-300">In review · Read guidelines to complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Stories History: Compact rows separated by dividers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#525866]">
              REPORTER BYLINE ARCHIVE
            </span>
            <h3 className="text-2xl font-bold text-[#172554] font-serif mt-0.5">
              Published & Submitted Articles ({userReports.length})
            </h3>
          </div>

          <button
            onClick={() => setScreen("create")}
            className="px-4 py-2 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Icon name="plus" size={15} />
            <span>New Report</span>
          </button>
        </div>

        <div className="divide-y divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          {userReports.length > 0 ? (
            userReports.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                isSaved={savedIds.includes(report.id)}
                onOpenDetails={onOpenDetails}
                onToggleSave={onToggleSave}
              />
            ))
          ) : (
            <div className="p-10 text-center text-[#525866] text-sm">
              No reports filed yet. Start reporting local issues to build your credential history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
