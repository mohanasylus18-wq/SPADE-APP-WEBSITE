import React, { useState, useEffect } from "react";
import { Report } from "../types";
import { Icon } from "./Icon";

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onAddComment: (reportId: string, text: string, role: string) => void;
  onShare: (report: Report) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onShare,
}) => {
  const [newComment, setNewComment] = useState("");
  const [commentRole, setCommentRole] = useState("Local Resident");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!report) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError("Please enter your comment before submitting.");
      return;
    }
    if (newComment.trim().length < 5) {
      setCommentError("Comment must be at least 5 characters long.");
      return;
    }
    onAddComment(report.id, newComment.trim(), commentRole);
    setNewComment("");
    setCommentError("");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-emerald-50 text-[#16845B] border-emerald-200";
      case "Corporation notified":
        return "bg-[#EAF0FF] text-[#172554] border-[#3867F6]/30";
      case "Live coverage":
        return "bg-[#FFF0F0] text-[#F04452] border-[#F04452]/30 font-bold";
      case "Under review":
        return "bg-amber-50 text-[#172554] border-amber-200";
      case "Resolved":
        return "bg-teal-50 text-teal-800 border-teal-200";
      default:
        return "bg-slate-50 text-[#525866] border-[#E5E7EB]";
    }
  };

  const mediaUrl = report.media || report.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#172554]/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-report-title"
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-[#FAFAF7] border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#525866]">
              REPORT #{report.id}
            </span>
            {report.isDemo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#EAF0FF] text-[#172554] border border-[#E5E7EB]">
                Demo content
              </span>
            )}
            {report.isUserSubmitted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#EAF0FF] text-[#172554] border border-[#E5E7EB]">
                <Icon name="user" size={12} /> Your Submission
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#525866] hover:text-[#171717] hover:bg-[#EAF0FF]/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            aria-label="Close report details"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#EAF0FF] text-[#172554]">
              {report.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                report.status
              )}`}
            >
              <i className="w-1.5 h-1.5 rounded-full bg-current" />
              {report.status}
            </span>
            {report.urgency === "Urgent" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFF0F0] text-[#F04452] border border-[#F04452]/20">
                <Icon name="alert-triangle" size={13} /> High Priority
              </span>
            )}
            <span className="text-sm text-[#525866] flex items-center gap-1 ml-auto">
              <Icon name="clock" size={14} /> {report.timeAgo || "Recently"}
            </span>
          </div>

          {/* Headline */}
          <h2
            id="modal-report-title"
            className="text-2xl sm:text-3xl font-extrabold text-[#172554] leading-tight tracking-tight font-serif"
          >
            {report.title}
          </h2>

          {/* Location & Reporter Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#E5E7EB] bg-white px-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-sm">
                {report.initials || report.author.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#171717] text-sm">
                  {report.author}
                  {report.verified && (
                    <span
                      className="inline-flex items-center text-[#16845B]"
                      title="Verified civic reporter"
                    >
                      <Icon name="badge" size={14} />
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#525866]">{report.authorRole || "Civic Monitor"}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#172554] bg-[#EAF0FF] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
              <Icon name="pin" size={16} className="text-[#F04452]" />
              <span>{report.location}</span>
            </div>
          </div>

          {/* Media View */}
          {mediaUrl && (
            <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB] bg-slate-900 group">
              <img
                src={mediaUrl}
                alt={report.alt || report.title}
                className="w-full max-h-[420px] object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold rounded-md border border-white/20">
                <Icon
                  name={
                    report.type === "Video"
                      ? "video"
                      : report.type === "Live"
                      ? "radio"
                      : "camera"
                  }
                  size={14}
                />
                <span>{report.type || "Photo"} Documentation</span>
              </div>
              {report.alt && (
                <div className="p-2.5 text-xs text-slate-300 bg-slate-950/90 border-t border-slate-800">
                  <span className="font-semibold text-white">Context note:</span> {report.alt}
                </div>
              )}
            </div>
          )}

          {/* Full Story Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#525866]">
              Story & Field Verification Details
            </h3>
            <p className="text-[#171717] text-base sm:text-[17px] leading-relaxed whitespace-pre-line font-normal">
              {report.description}
            </p>
          </div>

          {/* Verification & Official Updates Timeline */}
          {report.updates && report.updates.length > 0 && (
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#172554] flex items-center gap-2">
                  <Icon name="shield-check" size={17} className="text-[#16845B]" />
                  Verification & Civic Updates
                </h4>
                <span className="text-xs text-[#525866]">Official Timeline</span>
              </div>
              <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-[#E5E7EB]">
                {report.updates.map((update, idx) => (
                  <div key={idx} className="relative pl-8 text-sm">
                    <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#3867F6] border-2 border-white ring-2 ring-[#3867F6]/30 -translate-x-1/2" />
                    <span className="font-mono text-xs font-bold text-[#3867F6] block">
                      {update.time}
                    </span>
                    <p className="text-[#171717] mt-0.5">{update.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Engagement Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLike(report.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                  report.userLiked
                    ? "bg-[#FFF0F0] text-[#F04452] border-[#F04452]/30 shadow-xs"
                    : "bg-white text-[#171717] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                }`}
              >
                <Icon
                  name={report.userLiked ? "heart-filled" : "heart"}
                  size={16}
                  className={report.userLiked ? "text-[#F04452]" : ""}
                />
                <span>{report.likes || 0} Helpful</span>
              </button>

              <button
                onClick={() => onToggleSave(report.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                  report.isSaved
                    ? "bg-[#172554] text-white border-[#172554]"
                    : "bg-white text-[#171717] border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                }`}
              >
                <Icon
                  name={report.isSaved ? "bookmark-filled" : "bookmark"}
                  size={16}
                  className={report.isSaved ? "text-[#F5B942]" : ""}
                />
                <span>{report.isSaved ? "Saved to Bookmarks" : "Save Report"}</span>
              </button>
            </div>

            <button
              onClick={() => onShare(report)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[#171717] bg-white border border-[#E5E7EB] hover:bg-[#EAF0FF]/60 transition-colors"
            >
              <Icon name="share" size={16} />
              <span>Share Link</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="p-6 bg-white rounded-xl border border-[#E5E7EB] space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#172554] flex items-center gap-2">
                <Icon name="comment" size={18} />
                Witness Notes & Comments ({report.comments?.length || 0})
              </h4>
              <span className="text-xs text-[#525866]">Public civic record</span>
            </div>

            {/* Comment List */}
            <div className="space-y-3">
              {report.comments && report.comments.length > 0 ? (
                report.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-lg bg-[#FAFAF7] border border-[#E5E7EB] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-[10px]">
                          {comment.initials}
                        </span>
                        <strong className="text-[#171717] font-semibold">{comment.author}</strong>
                        {comment.role && (
                          <span className="px-2 py-0.5 rounded bg-[#EAF0FF] text-[#172554] font-medium text-[11px]">
                            {comment.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[#525866]">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-[#171717] pl-8 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#525866] italic py-2">
                  No witness comments yet. Be the first local contributor to share an update.
                </p>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-[#E5E7EB] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="new-comment-text"
                  className="text-xs font-bold uppercase tracking-wider text-[#525866]"
                >
                  Add Your Witness Note
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#525866]">Your role:</span>
                  <select
                    value={commentRole}
                    onChange={(e) => setCommentRole(e.target.value)}
                    className="text-xs font-medium px-2 py-1 rounded bg-[#FAFAF7] border border-[#E5E7EB] text-[#171717]"
                  >
                    <option value="Local Resident">Local Resident</option>
                    <option value="Daily Commuter">Daily Commuter</option>
                    <option value="Eye-witness">Eye-witness</option>
                    <option value="Community Volunteer">Community Volunteer</option>
                  </select>
                </div>
              </div>

              <textarea
                id="new-comment-text"
                rows={3}
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (commentError) setCommentError("");
                }}
                placeholder="Share eyewitness observations, repair status updates, or safety notes..."
                className="w-full p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFAF7] text-sm text-[#171717] placeholder-[#525866] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
              />

              {commentError && (
                <p className="text-xs font-semibold text-[#F04452] flex items-center gap-1">
                  <Icon name="alert-triangle" size={13} /> {commentError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Icon name="arrow" size={15} /> Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#EAF0FF]/50 border-t border-[#E5E7EB] flex justify-between items-center">
          <span className="text-xs text-[#525866]">
            SPADE Citizen Journalism Platform · Verified Public Record
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#171717] hover:bg-[#E5E7EB] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
