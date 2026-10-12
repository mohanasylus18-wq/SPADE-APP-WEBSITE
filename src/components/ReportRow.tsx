import React from "react";
import { Report } from "../types";
import { Icon } from "./Icon";

interface ReportRowProps {
  report: Report;
  isSaved: boolean;
  onOpenDetails: (report: Report) => void;
  onToggleSave: (id: string) => void;
  onShare?: (report: Report) => void;
}

export const ReportRow: React.FC<ReportRowProps> = ({
  report,
  isSaved,
  onOpenDetails,
  onToggleSave,
}) => {
  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case "Transport & Roads":
      case "Water & Sanitation":
        return "bg-[#EAF0FF] text-[#172554]";
      case "Public Safety":
        return "bg-[#FFF0F0] text-[#172554]";
      case "Environment & Waste":
        return "bg-[#EAF0FF] text-[#172554]";
      case "Community Events":
        return "bg-[#F5B942]/20 text-[#172554]";
      default:
        return "bg-[#EAF0FF] text-[#172554]";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-emerald-50 text-[#16845B] border-emerald-200";
      case "Corporation notified":
        return "bg-[#EAF0FF] text-[#172554] border-[#3867F6]/30";
      case "Live coverage":
        return "bg-[#FFF0F0] text-[#F04452] border-[#F04452]/30 font-bold";
      case "Under review":
        return "bg-amber-50 text-[#172554] border-amber-200";
      default:
        return "bg-slate-50 text-[#525866] border-[#E5E7EB]";
    }
  };

  const mediaUrl = report.media || report.image;

  return (
    <article className="p-5 sm:p-6 hover:bg-[#FAFAF7]/80 transition-colors flex flex-col md:flex-row gap-5 items-start">
      {/* Thumbnail if media exists */}
      {mediaUrl && (
        <div
          onClick={() => onOpenDetails(report)}
          className="relative w-full md:w-56 shrink-0 h-44 md:h-36 rounded-xl overflow-hidden bg-slate-900 cursor-pointer group border border-[#E5E7EB]"
        >
          <img
            src={mediaUrl}
            alt={report.alt || report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {report.type === "Live" && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F04452] text-white text-xs font-bold uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE
            </div>
          )}
        </div>
      )}

      {/* Row Content */}
      <div className="flex-1 min-w-0 space-y-2.5 w-full">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryClass(
              report.category
            )}`}
          >
            {report.category}
          </span>

          {report.isDemo && (
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#EAF0FF] text-[#172554] border border-[#E5E7EB]">
              Demo content
            </span>
          )}

          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusClass(
              report.status
            )}`}
          >
            {report.status}
          </span>

          <span className="text-[#525866] flex items-center gap-1 text-sm font-medium">
            <Icon name="pin" size={14} className="text-[#F04452]" />
            {report.location}
          </span>

          <span className="text-[#E5E7EB] hidden sm:inline">•</span>

          <span className="text-[#525866] text-sm flex items-center gap-1">
            <Icon name="clock" size={13} />
            {report.timeAgo || "Recently"}
          </span>
        </div>

        {/* Headline (20-26px bold serif) */}
        <h3
          onClick={() => onOpenDetails(report)}
          className="text-xl sm:text-[22px] font-bold text-[#172554] hover:text-[#3867F6] cursor-pointer transition-colors leading-snug tracking-tight font-serif"
        >
          {report.title}
        </h3>

        {/* Summary (16px body copy) */}
        <p className="text-base text-[#525866] line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Footer info & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Author info (>=14px) */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
              {report.initials || report.author.substring(0, 2).toUpperCase()}
            </span>
            <span className="text-sm font-bold text-[#171717]">{report.author}</span>
            {report.verified && (
              <span className="text-[#16845B]" title="Verified contributor">
                <Icon name="badge" size={14} />
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(report.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                isSaved
                  ? "bg-[#172554] text-white border-[#172554]"
                  : "bg-white text-[#525866] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
              }`}
              title={isSaved ? "Remove from bookmarks" : "Save report"}
              aria-label={isSaved ? "Saved" : "Save report"}
            >
              <Icon
                name={isSaved ? "bookmark-filled" : "bookmark"}
                size={15}
                className={isSaved ? "text-[#F5B942]" : ""}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={() => onOpenDetails(report)}
              className="px-3.5 py-1.5 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            >
              <span>Details</span>
              <Icon name="arrow" size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
