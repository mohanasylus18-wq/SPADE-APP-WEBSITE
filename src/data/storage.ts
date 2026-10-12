import { Report, UserProfile, AppSettings } from "../types";
import { INITIAL_REPORTS } from "./initialReports";

const STORAGE_KEYS = {
  REPORTS: "spade_reports_v2",
  SAVED_IDS: "spade_saved_ids_v2",
  USER_PROFILE: "spade_profile_v2",
  SETTINGS: "spade_settings_v2",
};

export const DEFAULT_USER: UserProfile = {
  name: "Amara King",
  initials: "AK",
  role: "Community Journalist & Civic Contributor",
  location: "Avadi, Tamil Nadu",
  bio: "Documenting local public affairs, civic infrastructure, and neighborhood transit developments in Avadi and Ambattur zones since 2024.",
  joinedDate: "July 2024 (11 months active)",
  trustScore: 96,
  badgeLevel: "Reliable Contributor",
  progressPercent: 78,
  verifiedCount: 19,
  responsesCount: 442,
};

export const DEFAULT_SETTINGS: AppSettings = {
  primaryNeighborhood: "Avadi & Ambattur",
  locationSharing: true,
  urgentAlerts: true,
  nearbyNotifications: true,
  reportStatusAlerts: true,
  compactFeedView: false,
};

export function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      saveReports(INITIAL_REPORTS);
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Synchronize saved states with saved IDs
      const savedIds = loadSavedReportIds();
      return parsed.map((r: Report) => ({
        ...r,
        isSaved: savedIds.includes(r.id),
      }));
    }
    return INITIAL_REPORTS;
  } catch (err) {
    console.warn("SPADE: Failed to parse stored reports, using seed data", err);
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: Report[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (err) {
    console.error("SPADE: Error saving reports to localStorage", err);
  }
}

export function loadSavedReportIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    if (!raw) return ["SPADE-2025-0104", "SPADE-2025-0103"];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedReportIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(ids));
  } catch (err) {
    console.error("SPADE: Error saving bookmarked IDs to localStorage", err);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error("SPADE: Error saving profile to localStorage", err);
  }
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error("SPADE: Error saving settings to localStorage", err);
  }
}

export function resetDemoStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_IDS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (err) {
    console.error("SPADE: Error clearing demo storage", err);
  }
}
