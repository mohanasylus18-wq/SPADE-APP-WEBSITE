import { useState, useEffect, useCallback, useRef } from "react";
import { Screen, Report, UserProfile, AppSettings } from "./types";
import {
  loadUserProfile,
  saveUserProfile,
  loadAppSettings,
  saveAppSettings,
} from "./data/storage";

import { ReportsProvider, useReports } from "./context/ReportsContext";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ReportDetailModal } from "./components/ReportDetailModal";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { Icon } from "./components/Icon";

import { DashboardView } from "./views/DashboardView";
import { LocalFeedView } from "./views/LocalFeedView";
import { ExploreNearbyView } from "./views/ExploreNearbyView";
import { CreateReportView } from "./views/CreateReportView";
import { LiveReportsView } from "./views/LiveReportsView";
import { SavedReportsView } from "./views/SavedReportsView";
import { MyContributionsView } from "./views/MyContributionsView";
import { JournalistProfileView } from "./views/JournalistProfileView";
import { HelpGuidelinesView } from "./views/HelpGuidelinesView";
import { SettingsView } from "./views/SettingsView";

const VALID_SCREENS: Screen[] = [
  "home",
  "feed",
  "nearby",
  "create",
  "live",
  "saved",
  "contributions",
  "profile",
  "help",
  "settings",
];

function getScreenFromHash(): Screen {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace(/^#/, "").toLowerCase() as Screen;
  return VALID_SCREENS.includes(hash) ? hash : "home";
}

function AppContent() {
  const {
    reports,
    savedIds,
    toggleSave,
    addReport,
    deleteReport,
    addComment,
    addUpdate,
    toggleLike,
    resetToDemoData,
  } = useReports();

  // Navigation State with Hash Routing
  const [screen, setScreen] = useState<Screen>(() => getScreenFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  // User Profile & Settings
  const [user, setUser] = useState<UserProfile>(() => loadUserProfile());
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Tamil Nadu (North Chennai)");
  const [locationOn, setLocationOn] = useState(settings.locationSharing);

  // Modals & Notifications
  const [activeReportModal, setActiveReportModal] = useState<Report | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync Hash on Browser Back / Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const nextScreen = getScreenFromHash();
      setScreen(nextScreen);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial check: if no hash, set #home
    if (!window.location.hash) {
      window.location.hash = "home";
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = useCallback((nextScreen: Screen) => {
    window.location.hash = nextScreen;
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sync user profile to localStorage
  useEffect(() => {
    saveUserProfile(user);
  }, [user]);

  // Sync settings to localStorage
  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  // Toast Helpers
  const addToast = useCallback(
    (title: string, description?: string, type: "success" | "info" | "error" = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handlers
  const handleToggleSave = useCallback(
    (reportId: string) => {
      const isNowSaved = toggleSave(reportId);

      // Keep active modal in sync
      setActiveReportModal((prev) => {
        if (!prev || prev.id !== reportId) return prev;
        return { ...prev, isSaved: isNowSaved };
      });

      if (isNowSaved) {
        addToast("Report Saved", "Added to your bookmarked reports dossier.", "success");
      } else {
        addToast("Report Removed", "Removed from your saved bookmarks.", "info");
      }
    },
    [toggleSave, addToast]
  );

  const handleShare = useCallback(
    (report: Report) => {
      const shareUrl = `${window.location.origin}/#report-${report.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            addToast("Citation Link Copied", `Direct citation link for report #${report.id} copied.`, "success");
          })
          .catch(() => {
            addToast("Citation Ready", `Report #${report.id}: ${report.title}`, "info");
          });
      } else {
        addToast("Citation Ready", `Report #${report.id}: ${report.title}`, "info");
      }
    },
    [addToast]
  );

  const handleSubmitNewReport = useCallback(
    (reportData: Report) => {
      const created = addReport(reportData);
      addToast(
        "Report Submitted",
        `Report #${created.id} is now queued for local community verification.`,
        "success"
      );
    },
    [addReport, addToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteReport(id);
      if (activeReportModal?.id === id) {
        setActiveReportModal(null);
      }
      addToast("Report Withdrawn", "Your submission was removed from local storage.", "info");
    },
    [deleteReport, activeReportModal, addToast]
  );

  const handleAddCommentToReport = useCallback(
    (reportId: string, text: string, role: string) => {
      addComment(reportId, text, role, user.name);

      // Update active modal comments if open
      setActiveReportModal((prev) => {
        if (!prev || prev.id !== reportId) return prev;
        const newC = {
          id: `c-${Date.now()}`,
          author: user.name,
          initials: user.initials,
          role,
          text,
          createdAt: "Just now",
        };
        const updated = [...(prev.comments || []), newC];
        return {
          ...prev,
          commentsCount: updated.length,
          comments: updated,
        };
      });

      addToast("Comment Published", "Your witness update was added to the public record.", "success");
    },
    [addComment, user, addToast]
  );

  const handleAddLiveUpdate = useCallback(
    (reportId: string, text: string) => {
      addUpdate(reportId, text, user.name);
      addToast("Live Dispatch Added", "Field check-in recorded on the active incident timeline.", "success");
    },
    [addUpdate, user, addToast]
  );

  const handleResetStorage = useCallback(() => {
    resetToDemoData();
    addToast("Demo Data Restored", "Initial Avadi and Ambattur reports restored in browser storage.", "info");
  }, [resetToDemoData, addToast]);

  const savedCount = savedIds.length;
  const contributionsCount = reports.filter(
    (r) => r.isUserSubmitted || r.author === user.name
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#171717] flex">
      {/* 1. Responsive Sidebar with Hash Navigation (Desktop >= 1024px fixed, Drawer below 1024px) */}
      <Sidebar
        screen={screen}
        onNavigate={navigateTo}
        savedCount={savedCount}
        contributionsCount={contributionsCount}
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        triggerButtonRef={triggerButtonRef}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 min-w-0 lg:ml-68 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar
          screen={screen}
          onNavigate={navigateTo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locationOn={locationOn}
          setLocationOn={(on) => {
            setLocationOn(on);
            setSettings((prev) => ({ ...prev, locationSharing: on }));
            addToast(
              on ? "Location Sharing Enabled" : "Location Sharing Disabled",
              on ? "Showing reports nearby Avadi and Ambattur first." : "Manual area selection active.",
              "info"
            );
          }}
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          triggerButtonRef={triggerButtonRef}
        />

        {/* 3. Main Page Content View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-7">
          {screen === "home" && (
            <DashboardView
              reports={reports}
              savedIds={savedIds}
              onNavigate={navigateTo}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleSave={handleToggleSave}
              locationOn={locationOn}
              setLocationOn={setLocationOn}
              selectedLocation={selectedLocation}
            />
          )}

          {screen === "feed" && (
            <LocalFeedView
              reports={reports}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleLike={toggleLike}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {screen === "nearby" && (
            <ExploreNearbyView
              reports={reports}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleLike={toggleLike}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
              locationOn={locationOn}
              setLocationOn={setLocationOn}
            />
          )}

          {screen === "create" && (
            <CreateReportView
              setScreen={navigateTo}
              onSubmitReport={handleSubmitNewReport}
              onOpenReportDetails={(r) => setActiveReportModal(r)}
              locationOn={locationOn}
              setLocationOn={setLocationOn}
            />
          )}

          {screen === "live" && (
            <LiveReportsView
              reports={reports}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleLike={toggleLike}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
              onAddUpdate={handleAddLiveUpdate}
            />
          )}

          {screen === "saved" && (
            <SavedReportsView
              reports={reports.filter((r) => savedIds.includes(r.id))}
              setScreen={navigateTo}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleLike={toggleLike}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
            />
          )}

          {screen === "contributions" && (
            <MyContributionsView
              reports={reports}
              setScreen={navigateTo}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleLike={toggleLike}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
              onDeleteReport={handleDelete}
            />
          )}

          {screen === "profile" && (
            <JournalistProfileView
              user={user}
              reports={reports}
              setScreen={navigateTo}
              onOpenDetails={(r) => setActiveReportModal(r)}
              onToggleLike={toggleLike}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
            />
          )}

          {screen === "help" && (
            <HelpGuidelinesView setScreen={navigateTo} />
          )}

          {screen === "settings" && (
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
              user={user}
              onUpdateUser={setUser}
              onResetData={handleResetStorage}
              savedCount={savedCount}
              reportsCount={reports.length}
            />
          )}

          {/* Placeholder Fallback for unknown views */}
          {!VALID_SCREENS.includes(screen) && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center mx-auto">
                <Icon name="info" size={28} />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#172554]">View Under Development</h2>
              <p className="text-base text-[#525866] max-w-md mx-auto">
                The section you requested is currently being prepared by the SPADE editorial team.
              </p>
              <button
                onClick={() => navigateTo("home")}
                className="px-5 py-2.5 bg-[#3867F6] text-white font-bold rounded-xl hover:bg-[#2753db] transition-colors"
              >
                Return to Community Newsroom
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 4. Full Report Detail Modal */}
      {activeReportModal && (
        <ReportDetailModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
          onToggleLike={toggleLike}
          onToggleSave={handleToggleSave}
          onAddComment={handleAddCommentToReport}
          onShare={handleShare}
        />
      )}

      {/* 5. Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <ReportsProvider>
      <AppContent />
    </ReportsProvider>
  );
}
