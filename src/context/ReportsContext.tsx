import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Report, ReportComment, ReportUpdate } from "../types";
import { INITIAL_REPORTS } from "../data/initialReports";

const STORAGE_KEYS = {
  REPORTS: "spade_reports_v2",
  SAVED_IDS: "spade_saved_ids_v2",
};

interface ReportsContextType {
  reports: Report[];
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => boolean;
  addReport: (reportData: Omit<Report, "id" | "createdAt" | "status"> & { status?: Report["status"] }) => Report;
  deleteReport: (id: string) => void;
  addComment: (reportId: string, text: string, role: string, authorName: string) => void;
  addUpdate: (reportId: string, text: string, actor: string) => void;
  toggleLike: (reportId: string) => void;
  resetToDemoData: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

function readStorageReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return INITIAL_REPORTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REPORTS;
  } catch (err) {
    console.warn("SPADE: Failed to read reports from localStorage, falling back to seed", err);
    return INITIAL_REPORTS;
  }
}

function writeStorageReports(reports: Report[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (err) {
    console.error("SPADE: Error writing reports to localStorage", err);
  }
}

function readStorageSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    if (!raw) return ["SPADE-2025-0104", "SPADE-2025-0103"];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("SPADE: Failed to read saved report IDs from localStorage", err);
    return ["SPADE-2025-0104", "SPADE-2025-0103"];
  }
}

function writeStorageSavedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(ids));
  } catch (err) {
    console.error("SPADE: Error writing saved report IDs to localStorage", err);
  }
}

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(() => readStorageReports());
  const [savedIds, setSavedIds] = useState<string[]>(() => readStorageSavedIds());

  // Sync reports to localStorage
  useEffect(() => {
    writeStorageReports(reports);
  }, [reports]);

  // Sync savedIds to localStorage
  useEffect(() => {
    writeStorageSavedIds(savedIds);
  }, [savedIds]);

  const isSaved = useCallback(
    (id: string) => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const toggleSave = useCallback(
    (id: string) => {
      let isNowSaved = false;
      setSavedIds((prev) => {
        if (prev.includes(id)) {
          isNowSaved = false;
          return prev.filter((item) => item !== id);
        } else {
          isNowSaved = true;
          return [...prev, id];
        }
      });
      return isNowSaved;
    },
    []
  );

  const addReport = useCallback(
    (reportData: Omit<Report, "id" | "createdAt" | "status"> & { status?: Report["status"] }) => {
      const newId = `SPADE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReport: Report = {
        ...reportData,
        id: newId,
        createdAt: new Date().toISOString(),
        timeAgo: "Just now",
        status: reportData.status || "Under review",
        isDemo: false,
        isUserSubmitted: true,
        likes: 1,
        userLiked: true,
        commentsCount: 0,
        comments: [],
        updates: [
          {
            time: "Just now",
            text: `Report filed by ${reportData.author}. Queued for local verification.`,
          },
        ],
      };

      setReports((prev) => [newReport, ...prev]);
      return newReport;
    },
    []
  );

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSavedIds((prev) => prev.filter((savedId) => savedId !== id));
  }, []);

  const addComment = useCallback(
    (reportId: string, text: string, role: string, authorName: string) => {
      const newComment: ReportComment = {
        id: `c-${Date.now()}`,
        author: authorName,
        initials: authorName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
        role,
        text,
        createdAt: "Just now",
      };

      setReports((prev) =>
        prev.map((r) => {
          if (r.id !== reportId) return r;
          const updated = [...(r.comments || []), newComment];
          return {
            ...r,
            commentsCount: updated.length,
            comments: updated,
          };
        })
      );
    },
    []
  );

  const addUpdate = useCallback((reportId: string, text: string, actor: string) => {
    const newUpdate: ReportUpdate = {
      time: "Just now",
      text,
      actor,
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          updates: [newUpdate, ...(r.updates || [])],
        };
      })
    );
  }, []);

  const toggleLike = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const newLiked = !r.userLiked;
        return {
          ...r,
          userLiked: newLiked,
          likes: (r.likes || 0) + (newLiked ? 1 : -1),
        };
      })
    );
  }, []);

  const resetToDemoData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.REPORTS);
      localStorage.removeItem(STORAGE_KEYS.SAVED_IDS);
    } catch (err) {
      console.warn("SPADE: Error clearing demo data from storage", err);
    }
    setReports(INITIAL_REPORTS);
    setSavedIds(["SPADE-2025-0104", "SPADE-2025-0103"]);
  }, []);

  return (
    <ReportsContext.Provider
      value={{
        reports,
        savedIds,
        isSaved,
        toggleSave,
        addReport,
        deleteReport,
        addComment,
        addUpdate,
        toggleLike,
        resetToDemoData,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
