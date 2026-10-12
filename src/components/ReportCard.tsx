import React from "react";
import { Report } from "../types";
import { Icon } from "./Icon";

interface ReportCardProps {
  report: Report;
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
  isSaved?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onOpenDetails,
  onToggleLike,
  onToggleSave,
  onShare,
  isSaved = false,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Transport & Roads":
      case "Water & Sanitation":
        return "bg-[#EAF0FF] text-[#172554] border-[#E5E7EB]";
      case "Public Safety":
        return "bg-[#FFF0F0] text-[#172554] border-[#E5E7EB]";
      case "Environment & Waste":
        return "bg-[#EAF0FF] text-[#172554] border-[#E5E7EB]";
      case "Community Events":
        return "bg-[#F5B942]/20 text-[#172554] border-[#E5E7EB]";
      default:
        return "bg-[#EAF0FF] text-[#172554] border-[#E5E7EB]";
    }
  };

  const getStatusBadge = (status: string) => {
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
    <article className="group bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#3867F6]/40 transition-all duration-200 overflow-hidden flex flex-col md:flex-row">
      {/* Media Thumbnail */}
      <div
        className="relative md:w-64 sm:h-56 md:h-auto shrink-0 bg-slate-900 overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(report)}
      >
        {mediaUrl ? (
          <img
            src={mediaUrl}
            alt={report.alt || report.title}
            className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 md:h-full flex items-center justify-center bg-[#FAFAF7] text-[#525866]">
            <Icon name="camera" size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Media type badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-white text-xs font-semibold">
          <Icon
            name={
              report.type === "Video"
                ? "video"
                : report.type === "Live"
                ? "radio"
                : "camera"
            }
            size={13}
          />
          <span>{report.type || "Photo"}</span>
        </div>

        {/* Live Indicator */}
        {report.type === "Live" && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F04452] text-white text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            LIVE
          </div>
        )}

        {report.isUserSubmitted && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#172554] text-white text-xs font-semibold shadow-xs">
            <Icon name="user" size={11} /> You submitted
          </div>
        )}
      </div>

      {/* Report Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Header Metadata (>= 14px) */}
          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-xs border ${getCategoryColor(
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

            <span className="text-[#525866] flex items-center gap-1 text-sm font-medium">
              <Icon name="pin" size={14} className="text-[#F04452]" />
              {report.location}
            </span>

            <span className="text-[#E5E7EB] hidden sm:inline">•</span>

            <span className="text-[#525866] text-sm flex items-center gap-1">
              <Icon name="clock" size={13} />
              {report.timeAgo || "Recently"}
            </span>

            <span
              className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(
                report.status
              )}`}
            >
              {report.status}
            </span>
          </div>

          {/* Headline (20-26px bold serif) */}
          <h3
            onClick={() => onOpenDetails(report)}
            className="text-xl sm:text-[22px] font-bold text-[#172554] hover:text-[#3867F6] cursor-pointer transition-colors leading-snug tracking-tight font-serif mb-2"
          >
            {report.title}
          </h3>

          {/* Body snippet (16px) */}
          <p className="text-base text-[#525866] line-clamp-2 leading-relaxed mb-4">
            {report.description}
          </p>
        </div>

        {/* Footer: Contributor Info & Engagement */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
            {/* Contributor (>= 14px) */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
                {report.initials || report.author.substring(0, 2).toUpperCase()}
              </span>
              <div className="text-sm">
                <span className="font-bold text-[#171717] flex items-center gap-1">
                  {report.author}
                  {report.verified && (
                    <span className="text-[#16845B]" title="Verified Reporter">
                      <Icon name="badge" size={14} />
                    </span>
                  )}
                </span>
                <span className="text-[#525866] text-xs">{report.authorRole || "Civic Monitor"}</span>
              </div>
            </div>

            {/* Interaction Buttons (Cobalt actions, neutral default) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLike(report.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                  report.userLiked
                    ? "bg-[#FFF0F0] text-[#F04452] border-[#F04452]/30"
                    : "bg-white text-[#525866] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                }`}
                aria-label={`Like report, ${report.likes || 0} marks`}
              >
                <Icon
                  name={report.userLiked ? "heart-filled" : "heart"}
                  size={15}
                  className={report.userLiked ? "text-[#F04452]" : ""}
                />
                <span>{report.likes || 0}</span>
              </button>

              <button
                onClick={() => onOpenDetails(report)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold bg-white text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60 transition-colors"
                aria-label={`View comments, ${report.commentsCount || report.comments?.length || 0} comments`}
              >
                <Icon name="comment" size={15} />
                <span>{report.commentsCount || report.comments?.length || 0}</span>
              </button>

              <button
                onClick={() => onToggleSave(report.id)}
                className={`p-1.5 rounded-lg text-sm border transition-colors ${
                  isSaved || report.isSaved
                    ? "bg-[#172554] text-white border-[#172554]"
                    : "bg-white text-[#525866] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                }`}
                title={isSaved || report.isSaved ? "Remove from bookmarks" : "Save report to bookmarks"}
                aria-label={isSaved || report.isSaved ? "Saved" : "Save"}
              >
                <Icon
                  name={isSaved || report.isSaved ? "bookmark-filled" : "bookmark"}
                  size={15}
                  className={isSaved || report.isSaved ? "text-[#F5B942]" : ""}
                />
              </button>

              <button
                onClick={() => onShare(report)}
                className="p-1.5 rounded-lg text-sm bg-white text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60 transition-colors"
                title="Share report citation"
                aria-label="Share"
              >
                <Icon name="share" size={15} />
              </button>

              <button
                onClick={() => onOpenDetails(report)}
                className="ml-1 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-[#3867F6] text-white hover:bg-[#2753db] transition-colors flex items-center gap-1 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
              >
                <span>Details</span>
                <Icon name="arrow" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
