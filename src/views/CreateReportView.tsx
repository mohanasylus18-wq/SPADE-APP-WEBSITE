import React, { useState, useRef, useEffect } from "react";
import { Report, Screen, Category } from "../types";
import { Icon } from "../components/Icon";

interface CreateReportViewProps {
  setScreen: (screen: Screen) => void;
  onSubmitReport: (newReport: Report) => void;
  onOpenReportDetails: (report: Report) => void;
  locationOn: boolean;
  setLocationOn: (on: boolean) => void;
}

const CATEGORIES: Category[] = [
  "Transport & Roads",
  "Water & Sanitation",
  "Public Safety",
  "Environment & Waste",
  "Public Infrastructure",
  "Education",
  "Health",
  "Community Events",
];

const SUGGESTED_LOCATIONS = [
  "Avadi Bus Depot Exit, Avadi",
  "CTH Road junction, Ambattur",
  "S.A. Engineering College, Poonamallee",
  "Ambattur OT Market, Chennai",
  "Paruthipattu Lake Canal, Avadi",
  "Poonamallee Bypass Road",
];

export const CreateReportView: React.FC<CreateReportViewProps> = ({
  setScreen,
  onSubmitReport,
  onOpenReportDetails,
  locationOn,
  setLocationOn,
}) => {
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Transport & Roads");
  const [locationText, setLocationText] = useState("Avadi, Tamil Nadu");
  const [urgency, setUrgency] = useState<"Normal" | "Elevated" | "Urgent">("Normal");

  // Media upload state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"Photo" | "Video">("Photo");
  const [mediaError, setMediaError] = useState<string>("");

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up any object URLs if the component unmounts
  useEffect(() => {
    return () => {
      if (mediaPreviewUrl && mediaPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    };
  }, [mediaPreviewUrl]);

  // Compress image to Base64 for safe localStorage persistence
  const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          // Max dimension 800px to keep localStorage size reasonable
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Use JPEG compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    // We only support images for localStorage base64 conversion in this demo
    if (!isImage) {
      setMediaError("Unsupported file format. Please upload JPG, JPEG, PNG, or WebP images.");
      return;
    }

    // Validate size (max 5MB for the raw file before compression)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMediaError("File size exceeds 5MB limit. Please select a smaller photo.");
      return;
    }

    try {
      setIsProcessing(true);
      // Generate object URL for immediate crisp preview
      const objectUrl = URL.createObjectURL(file);
      
      // Clean up previous blob URL if replacing
      if (mediaPreviewUrl && mediaPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
      
      setMediaFile(file);
      setMediaType("Photo");
      setMediaPreviewUrl(objectUrl);
    } catch (err) {
      setMediaError("Error processing the image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveMedia = () => {
    if (mediaPreviewUrl && mediaPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }
    setMediaFile(null);
    setMediaPreviewUrl("");
    setMediaError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUsePresetMedia = (url: string, type: "Photo" | "Video") => {
    handleRemoveMedia();
    setMediaPreviewUrl(url);
    setMediaType(type);
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Report headline is required.";
    } else if (title.trim().length < 10) {
      newErrors.title = "Headline should be at least 10 characters for clarity.";
    }

    if (!description.trim()) {
      newErrors.description = "Story details and factual description are required.";
    } else if (description.trim().length < 25) {
      newErrors.description = "Please provide more context (at least 25 characters).";
    }

    if (!locationText.trim()) {
      newErrors.location = "Location or landmark is required to route your report.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }
    
    setIsProcessing(true);

    try {
      let finalMediaDataUrl = mediaPreviewUrl;
      
      // If the current preview is a blob (meaning the user uploaded a local file)
      // we MUST convert it to base64 so it survives a page refresh in localStorage.
      if (mediaFile && mediaPreviewUrl.startsWith("blob:")) {
        finalMediaDataUrl = await compressImageToBase64(mediaFile);
      }

      const reportId = `SPADE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newReport: Report = {
        id: reportId,
        type: mediaType,
        title: title.trim(),
        description: description.trim(),
        category,
        location: locationText.trim(),
        neighborhood: locationText.includes("Ambattur")
          ? "Ambattur"
          : locationText.includes("Poonamallee")
          ? "Poonamallee"
          : "Avadi",
        createdAt: new Date().toISOString(),
        timeAgo: "Just now",
        author: "Amara King",
        authorRole: "Community Journalist",
        initials: "AK",
        verified: false,
        status: "Under review",
        isDemo: false,
        isUserSubmitted: true,
        likes: 1,
        userLiked: true,
        commentsCount: 0,
        comments: [],
        updates: [
          {
            time: "Just now",
            text: "Report filed by Amara King. Pending local fact-check and community corroboration.",
          },
        ],
        // Allow text-only reports by checking if finalMediaDataUrl exists
        media: finalMediaDataUrl || undefined,
        image: finalMediaDataUrl || undefined,
        alt: title.trim(),
        urgency,
        coordinates: { lat: 13.1147, lng: 80.1018 },
      };

      onSubmitReport(newReport);
      setSubmittedReport(newReport);

      // Reset fields after successful submission
      setTitle("");
      setDescription("");
      handleRemoveMedia();
      setErrors({});
    } catch (err) {
      setMediaError("Failed to process image for storage. Please try a smaller file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-12">
      {/* Back Button */}
      <button
        onClick={() => setScreen("home")}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#525866] hover:text-[#171717] transition-colors focus-visible:ring-2 focus-visible:ring-[#3867F6]"
      >
        <Icon name="arrow" size={14} className="rotate-180" />
        <span>Back to Community Newsroom</span>
      </button>

      {/* Page Header (Card container) */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
            CITIZEN REPORTING DESK
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif">
            Report What Matters.
          </h1>
          <p className="text-base text-[#525866] max-w-xl">
            Share firsthand, factual civic developments that affect your neighborhood. Verified
            reports are routed to local monitors and municipal authorities.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAF7] border border-[#E5E7EB] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#16845B]" />
          <div>
            <span className="font-bold text-[#171717] block">Local Draft Mode</span>
            <span className="text-xs text-[#525866]">Stored in browser localStorage</span>
          </div>
        </div>
      </div>

      {/* Post-submission Success Banner */}
      {submittedReport && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 shadow-xs space-y-4 animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#16845B] text-white flex items-center justify-center shrink-0">
              <Icon name="check-circle" size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-emerald-950">
                Report Submitted for Review (#{submittedReport.id})
              </h3>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                Your report has been recorded in the app state and stored in your browser storage. It
                is now visible in the <strong>Local Feed</strong> and under{" "}
                <strong>My Contributions</strong> with status{" "}
                <span className="font-semibold text-emerald-950 underline">Under review</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pl-13">
            <button
              onClick={() => onOpenReportDetails(submittedReport)}
              className="px-4 py-2 bg-[#172554] hover:bg-[#1e3a8a] text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>View Your Report</span>
              <Icon name="arrow" size={13} />
            </button>
            <button
              onClick={() => setScreen("contributions")}
              className="px-4 py-2 bg-white text-[#172554] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60 text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              Go to My Contributions
            </button>
            <button
              onClick={() => setSubmittedReport(null)}
              className="px-3 py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 ml-auto cursor-pointer"
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Step Form (Cards for Form Sections) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step A: Tell Your Story (Card) */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#172554] text-white flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#172554] font-serif">Tell Your Story</h2>
              <p className="text-sm text-[#525866]">
                Lead with factual, firsthand observations. Avoid hearsay.
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="report-title" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Report Headline <span className="text-[#F04452]">*</span>
              </label>
              <span className="text-xs font-mono text-[#525866]">
                {title.length} / 100 chars
              </span>
            </div>
            <input
              id="report-title"
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="E.g., Deep subsidence hole outside Avadi Bus Depot entrance"
              className={`w-full p-3.5 bg-[#FAFAF7] border rounded-xl text-base text-[#171717] placeholder-[#525866] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6] focus:bg-white transition-all ${
                errors.title ? "border-[#F04452] ring-1 ring-[#F04452]" : "border-[#E5E7EB]"
              }`}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-[#F04452] flex items-center gap-1">
                <Icon name="alert-triangle" size={13} /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="report-desc" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Detailed Description & Context <span className="text-[#F04452]">*</span>
              </label>
              <span className="text-xs font-mono text-[#525866]">
                {description.length} / 1000 chars
              </span>
            </div>
            <textarea
              id="report-desc"
              rows={5}
              maxLength={1000}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe what happened: date/time witnessed, specific landmarks, how traffic or pedestrians are impacted, and whether any repair crew was seen..."
              className={`w-full p-3.5 bg-[#FAFAF7] border rounded-xl text-base text-[#171717] placeholder-[#525866] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6] focus:bg-white transition-all leading-relaxed ${
                errors.description ? "border-[#F04452] ring-1 ring-[#F04452]" : "border-[#E5E7EB]"
              }`}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-[#F04452] flex items-center gap-1">
                <Icon name="alert-triangle" size={13} /> {errors.description}
              </p>
            )}
            <p className="text-xs text-[#525866]">
              Please refrain from publishing personal phone numbers, license plates, or names of
              private individuals without consent.
            </p>
          </div>
        </div>

        {/* Step B: Add Evidence (Card) */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#172554] text-white flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#172554] font-serif">Add Evidence</h2>
              <p className="text-sm text-[#525866]">
                Photographs verify reports faster. (Optional)
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#EAF0FF]/50 border border-[#E5E7EB] rounded-lg text-sm text-[#525866] flex items-center gap-2 mb-4">
             <Icon name="info" size={16} className="text-[#3867F6]" />
             <span>Uploads are persisted in <strong>localStorage</strong>. Image files will be compressed automatically before saving to avoid breaking storage limits.</span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id="evidence-file-input"
          />

          {/* Media Preview or Upload Zone */}
          {mediaPreviewUrl ? (
            <div className="relative rounded-xl border border-[#E5E7EB] overflow-hidden bg-slate-900">
              {mediaType === "Video" ? (
                <div className="p-8 text-center text-white space-y-2">
                  <Icon name="video" size={36} className="mx-auto text-[#3867F6]" />
                  <span className="font-bold text-sm block">Video clip attached</span>
                  <span className="text-xs text-slate-400">
                    {mediaFile ? mediaFile.name : "Video file"}
                  </span>
                </div>
              ) : (
                <img
                  src={mediaPreviewUrl}
                  alt="Uploaded evidence preview"
                  className="w-full max-h-72 object-cover"
                />
              )}

              <div className="p-3 bg-white/95 border-t border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#172554] text-white font-bold text-[11px]">
                    {mediaType}
                  </span>
                  <span className="font-semibold text-[#171717] truncate max-w-xs text-sm">
                    {mediaFile ? mediaFile.name : "Custom preview photo"}
                  </span>
                  {mediaFile && (
                    <span className="text-[#525866]">
                      ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="px-3 py-1 bg-[#FFF0F0] text-[#F04452] hover:bg-[#FFF0F0]/80 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="trash" size={13} />
                  <span>Remove Media</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E5E7EB] hover:border-[#3867F6] rounded-xl p-8 text-center bg-[#FAFAF7] hover:bg-white transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#EAF0FF] text-[#172554] group-hover:scale-110 flex items-center justify-center mx-auto transition-transform">
                <Icon name="upload" size={22} className="text-[#3867F6]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] mt-3">
                Click to browse or drop an image
              </h3>
              <p className="text-sm text-[#525866] mt-1">
                Supports JPG, PNG, WEBP up to 5 MB
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#172554] group-hover:border-[#3867F6]"
              >
                Browse Files
              </button>
            </div>
          )}

          {mediaError && (
            <p className="text-xs font-semibold text-[#F04452] flex items-center gap-1">
              <Icon name="alert-triangle" size={13} /> {mediaError}
            </p>
          )}

          {/* Quick Preset Imagery Options */}
          <div className="pt-2">
            <span className="text-xs font-bold text-[#525866] block mb-2">
              Or pick a sample Tamil Nadu civic image for demonstration:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleUsePresetMedia(
                    "https://images.unsplash.com/photo-1560782205-4dd83ceb0270?auto=format&fit=crop&w=1200&q=82",
                    "Photo"
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-[#EAF0FF] hover:bg-[#EAF0FF]/80 text-[#172554] font-medium transition-colors"
              >
                Potholed Road
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetMedia(
                    "https://images.unsplash.com/photo-1781179740173-10ed914f8b83?auto=format&fit=crop&w=1200&q=82",
                    "Photo"
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-[#EAF0FF] hover:bg-[#EAF0FF]/80 text-[#172554] font-medium transition-colors"
              >
                Dark Streetlights
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetMedia(
                    "https://images.unsplash.com/photo-1688846875539-3e668edcb853?auto=format&fit=crop&w=1200&q=82",
                    "Photo"
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-[#EAF0FF] hover:bg-[#EAF0FF]/80 text-[#172554] font-medium transition-colors"
              >
                Water Leakage
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetMedia(
                    "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?auto=format&fit=crop&w=1200&q=82",
                    "Photo"
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-[#EAF0FF] hover:bg-[#EAF0FF]/80 text-[#172554] font-medium transition-colors"
              >
                Waste Bin
              </button>
            </div>
          </div>
        </div>

        {/* Step C: Add Context (Card) */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#172554] text-white flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#172554] font-serif">Add Context</h2>
              <p className="text-sm text-[#525866]">
                Categorize and localize your report so the right community monitors find it.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="report-category" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Report Category <span className="text-[#F04452]">*</span>
              </label>
              <select
                id="report-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-base font-semibold text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div className="space-y-1.5">
              <label htmlFor="report-urgency" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Urgency Level
              </label>
              <select
                id="report-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as "Normal" | "Elevated" | "Urgent")}
                className="w-full p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-xl text-base font-semibold text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6]"
              >
                <option value="Normal">Normal (Routine civic observation)</option>
                <option value="Elevated">Elevated (Active community nuisance/delay)</option>
                <option value="Urgent">Urgent (Safety hazard / immediate fix needed)</option>
              </select>
            </div>
          </div>

          {/* Location input with suggestions */}
          <div className="space-y-2">
            <label htmlFor="report-location" className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Location / Landmark <span className="text-[#F04452]">*</span>
            </label>
            <div className="relative">
              <input
                id="report-location"
                type="text"
                value={locationText}
                onChange={(e) => {
                  setLocationText(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
                }}
                placeholder="Street name, landmark, or junction..."
                className={`w-full pl-10 pr-4 py-3.5 bg-[#FAFAF7] border rounded-xl text-base text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#3867F6] ${
                  errors.location ? "border-[#F04452]" : "border-[#E5E7EB]"
                }`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F04452]">
                <Icon name="pin" size={18} />
              </div>
            </div>
            {errors.location && (
              <p className="text-xs font-semibold text-[#F04452] flex items-center gap-1">
                <Icon name="alert-triangle" size={13} /> {errors.location}
              </p>
            )}

            {/* Location suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-[#525866]">Quick select:</span>
              {SUGGESTED_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationText(loc)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#EAF0FF] hover:bg-[#EAF0FF]/80 text-[#172554] transition-colors font-medium"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Location Permission Toggle & Privacy */}
          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                <Icon name="shield-check" size={16} className="text-[#16845B]" />
                <span>Privacy & Location Permission</span>
              </div>
              <p className="text-xs text-[#525866] max-w-xl leading-relaxed">
                Precise GPS coordinates are never made public without your explicit consent. We only
                use general neighborhood routing so nearby spaders can corroborate the issue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLocationOn(!locationOn)}
              className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                locationOn ? "bg-[#172554]" : "bg-slate-300"
              }`}
              aria-label="Toggle location permission"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  locationOn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="text-xs text-[#525866]">
            By submitting, you agree to the SPADE Citizen Journalism Code of Conduct.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (validateForm()) setPreviewOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#171717] hover:bg-[#EAF0FF]/60 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Icon name="eye" size={16} />
              <span>Preview Report</span>
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#3867F6] hover:bg-[#2753db] disabled:opacity-75 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
            >
              <Icon name="arrow" size={16} />
              <span>{isProcessing ? "Processing..." : "Submit for Verification"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Interactive Report Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172554]/70 backdrop-blur-xs"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#FAFAF7] border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden animate-slide-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-white border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5B942]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#172554]">
                  LIVE DRAFT PREVIEW
                </span>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 text-[#525866] hover:text-[#171717] rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
                  {category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#172554] border border-amber-300">
                  Status: Under Review
                </span>
                <span className="text-xs text-[#525866] ml-auto">Pending submission</span>
              </div>

              <h2 className="text-2xl font-black text-[#172554] font-serif leading-tight break-words">
                {title || "Untitled Report"}
              </h2>

              <div className="text-sm text-[#525866] flex items-center gap-2">
                <Icon name="pin" size={14} className="text-[#F04452]" />
                <span className="font-semibold text-[#171717]">{locationText || "No location set"}</span>
                <span>•</span>
                <span>Reported by Amara King</span>
              </div>

              {mediaPreviewUrl && (
                <div className="rounded-xl overflow-hidden border border-[#E5E7EB] bg-slate-900">
                  <img
                    src={mediaPreviewUrl}
                    alt="Preview evidence"
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              )}

              <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#525866]">
                  Story Details
                </h4>
                <p className="text-sm sm:text-base text-[#171717] leading-relaxed whitespace-pre-line break-words">
                  {description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex items-center justify-between shrink-0">
              <span className="text-xs text-[#525866]">Review all details before submitting</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#171717] hover:bg-[#FAFAF7] border border-transparent hover:border-[#E5E7EB] rounded-lg transition-colors"
                >
                  Edit Further
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={(e) => {
                    setPreviewOpen(false);
                    handleSubmit(e);
                  }}
                  className="px-5 py-2 text-xs font-bold bg-[#3867F6] hover:bg-[#2753db] disabled:opacity-75 disabled:cursor-not-allowed text-white rounded-lg shadow-xs transition-colors"
                >
                  {isProcessing ? "Processing..." : "Confirm & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
