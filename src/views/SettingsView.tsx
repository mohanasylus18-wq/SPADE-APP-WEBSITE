import React, { useState } from "react";
import { AppSettings, UserProfile } from "../types";
import { Icon } from "../components/Icon";

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
  onResetData: () => void;
  savedCount: number;
  reportsCount: number;
}

const NEIGHBORHOOD_OPTIONS = [
  "Avadi & Ambattur",
  "Avadi Central",
  "Ambattur Industrial Estate",
  "Poonamallee & S.A. College Area",
  "Chennai Western Metro",
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  user,
  onUpdateUser,
  onResetData,
  savedCount,
  reportsCount,
}) => {
  const [userName, setUserName] = useState(user.name);
  const [userBio, setUserBio] = useState(user.bio);
  const [userLocation, setUserLocation] = useState(user.location);
  const [profileSaved, setProfileSaved] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: userName,
      bio: userBio,
      location: userLocation,
      initials: userName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleToggle = (key: keyof AppSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="space-y-7 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
          <Icon name="settings" size={13} className="text-[#3867F6]" />
          PREFERENCES & BROWSER STORAGE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif mt-2">
          Platform Settings & Privacy
        </h1>
        <p className="text-base text-[#525866] mt-1 max-w-xl">
          Configure your reporting beat, privacy toggles, local browser storage, and demo preferences.
        </p>

        {/* Global Rule Note: Persistence is localStorage only */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center gap-3 text-sm text-[#525866]">
          <Icon name="info" size={17} className="text-[#3867F6] shrink-0" />
          <span>
            <strong>Storage Notice:</strong> All data persistence is browser-local (`localStorage` only).
            Reports, comments, and bookmarks remain on this device and are not uploaded to remote cloud databases.
          </span>
        </div>
      </div>

      {/* 1. Location Preferences */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center">
            <Icon name="location" size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172554]">Reporting Zone & Location Preferences</h2>
            <p className="text-xs text-[#525866]">Define your primary beat in Tamil Nadu</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="primary-beat-select" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Primary Neighborhood Beat
            </label>
            <select
              id="primary-beat-select"
              value={settings.primaryNeighborhood}
              onChange={(e) =>
                onUpdateSettings({ ...settings, primaryNeighborhood: e.target.value })
              }
              className="w-full p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
            >
              {NEIGHBORHOOD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Location Permission Toggle */}
          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-[#171717] block">
                Share My Approximate Location
              </span>
              <p className="text-xs text-[#525866] max-w-lg leading-relaxed">
                When enabled, the app prioritizes civic reports from your selected neighborhood (Avadi,
                Ambattur, or Poonamallee). No continuous GPS tracking is performed.
              </p>
            </div>

            <button
              onClick={() => handleToggle("locationSharing")}
              className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                settings.locationSharing ? "bg-[#172554]" : "bg-slate-300"
              }`}
              aria-label="Toggle location sharing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.locationSharing ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center">
            <Icon name="bell" size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172554]">Notification Preferences</h2>
            <p className="text-xs text-[#525866]">In-app alerts and civic dispatch notifications</p>
          </div>
        </div>

        <div className="space-y-3.5 divide-y divide-[#E5E7EB]">
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-[#171717] block">
                Urgent Civic Alerts & Road Hazards
              </span>
              <p className="text-xs text-[#525866]">
                Notify when high-priority emergencies (water main bursts, deep road subsidence) are
                posted in your corridor.
              </p>
            </div>
            <button
              onClick={() => handleToggle("urgentAlerts")}
              className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                settings.urgentAlerts ? "bg-[#172554]" : "bg-slate-300"
              }`}
              aria-label="Toggle urgent alerts"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.urgentAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="pt-3.5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-[#171717] block">
                Nearby Incident Dispatches
              </span>
              <p className="text-xs text-[#525866]">
                Alert me when new citizen stories are filed within a 5 km radius of my location.
              </p>
            </div>
            <button
              onClick={() => handleToggle("nearbyNotifications")}
              className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                settings.nearbyNotifications ? "bg-[#172554]" : "bg-slate-300"
              }`}
              aria-label="Toggle nearby notifications"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.nearbyNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="pt-3.5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-[#171717] block">
                Status Change on My Submissions
              </span>
              <p className="text-xs text-[#525866]">
                Notify when my reports are verified by monitors or forwarded to municipal ward
                officers.
              </p>
            </div>
            <button
              onClick={() => handleToggle("reportStatusAlerts")}
              className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                settings.reportStatusAlerts ? "bg-[#172554]" : "bg-slate-300"
              }`}
              aria-label="Toggle status alerts"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.reportStatusAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Contributor Profile Settings */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center">
            <Icon name="user" size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172554]">Contributor Byline & Identity</h2>
            <p className="text-xs text-[#525866]">Public information attached to your submitted reports</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="settings-full-name" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Full Byline Name
            </label>
            <input
              id="settings-full-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-home-neighborhood" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Home Neighborhood / Area
            </label>
            <input
              id="settings-home-neighborhood"
              type="text"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="w-full p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-reporter-bio" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Reporter Bio
            </label>
            <textarea
              id="settings-reporter-bio"
              rows={3}
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              className="w-full p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-sm text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6] leading-relaxed"
            />
          </div>

          {profileSaved && (
            <p className="text-xs font-bold text-[#16845B] flex items-center gap-1">
              <Icon name="check-circle" size={14} /> Profile details saved to browser storage.
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            >
              Update Profile Byline
            </button>
          </div>
        </div>
      </form>

      {/* 4. Storage & Demo Data Management */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#EAF0FF] text-[#172554] flex items-center justify-center">
            <Icon name="layers" size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172554]">Demo Data & Local Storage</h2>
            <p className="text-xs text-[#525866]">Review stored state or reset to initial demonstration seed</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E5E7EB]">
            <span className="text-[#525866] block">Stored Reports</span>
            <strong className="text-lg text-[#171717]">{reportsCount} entries</strong>
          </div>

          <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E5E7EB]">
            <span className="text-[#525866] block">Saved Bookmarks</span>
            <strong className="text-lg text-[#171717]">{savedCount} items</strong>
          </div>

          <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E5E7EB]">
            <span className="text-[#525866] block">Storage Engine</span>
            <strong className="text-lg text-[#171717]">Browser localStorage</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF0F0] border border-[#F04452]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#172554]">Reset Demo State</h3>
            <p className="text-xs text-[#525866] leading-relaxed max-w-lg">
              Clears all custom reports, witness comments, and bookmarks created in this browser,
              restoring the initial Avadi and Ambattur sample dataset.
            </p>
          </div>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2 bg-[#F04452] hover:bg-[#d6303e] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            Reset Demo Data
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {resetConfirmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172554]/70 backdrop-blur-xs"
            onClick={() => setResetConfirmOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF0F0] text-[#F04452] flex items-center justify-center shrink-0">
                  <Icon name="alert-triangle" size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#171717]">Reset Demo Storage?</h4>
                  <p className="text-xs text-[#525866]">
                    This will clear all created reports and restore initial data in localStorage.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#171717] hover:bg-[#FAFAF7] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResetData();
                    setResetConfirmOpen(false);
                  }}
                  className="px-4 py-2 bg-[#F04452] hover:bg-[#d6303e] text-white text-xs font-bold rounded-lg"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Privacy Statement */}
      <div className="p-6 rounded-2xl bg-[#EAF0FF]/50 border border-[#E5E7EB] space-y-2 text-xs text-[#525866] leading-relaxed">
        <h4 className="font-bold text-[#172554] uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Icon name="shield-check" size={15} className="text-[#16845B]" />
          Privacy & Data Protection Notice
        </h4>
        <p>
          SPADE is designed to empower community members with public-interest civic reporting while
          respecting personal privacy. We do not sell user data, run third-party advertising trackers,
          or record private phone numbers. Location information is used solely within your browser
          session to filter relevant civic issues within Tamil Nadu.
        </p>
      </div>
    </div>
  );
};
