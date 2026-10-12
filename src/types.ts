export type Screen =
  | "home"
  | "feed"
  | "nearby"
  | "create"
  | "live"
  | "saved"
  | "contributions"
  | "profile"
  | "help"
  | "settings";

export type Category =
  | "Public Infrastructure"
  | "Public Safety"
  | "Environment & Waste"
  | "Transport & Roads"
  | "Water & Sanitation"
  | "Education"
  | "Health"
  | "Community Events";

export type ReportStatus =
  | "Open issue"
  | "Corporation notified"
  | "Under review"
  | "Live coverage"
  | "Verified"
  | "Resolved";

export interface ReportComment {
  id: string;
  author: string;
  initials: string;
  role?: string;
  text: string;
  createdAt: string;
}

export interface ReportUpdate {
  time: string;
  text: string;
  actor?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  author: string;
  createdAt: string;
  media?: string;
  image?: string; // backwards compatibility
  alt?: string;
  status: ReportStatus;
  isDemo?: boolean; // clearly distinguishes demo content from user submissions
  type?: "Photo" | "Video" | "Text" | "Live";
  neighborhood?: string;
  timeAgo?: string;
  authorRole?: string;
  initials?: string;
  verified?: boolean;
  likes?: number;
  userLiked?: boolean;
  commentsCount?: number;
  comments?: ReportComment[];
  updates?: ReportUpdate[];
  videoUrl?: string;
  isUserSubmitted?: boolean;
  urgency?: "Normal" | "Elevated" | "Urgent";
  coordinates?: { lat: number; lng: number };
}

export interface UserProfile {
  name: string;
  initials: string;
  role: string;
  location: string;
  bio: string;
  joinedDate: string;
  trustScore: number;
  badgeLevel: string;
  progressPercent: number;
  verifiedCount: number;
  responsesCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: "alert" | "update" | "community";
}

export interface AppSettings {
  primaryNeighborhood: string;
  locationSharing: boolean;
  urgentAlerts: boolean;
  nearbyNotifications: boolean;
  reportStatusAlerts: boolean;
  compactFeedView: boolean;
}
