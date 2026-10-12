import React, { useState, useMemo } from "react";
import { Report, Category } from "../types";
import { Icon } from "../components/Icon";

interface ExploreNearbyViewProps {
  reports: Report[];
  onOpenDetails: (report: Report) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onShare: (report: Report) => void;
  locationOn: boolean;
  setLocationOn: (on: boolean) => void;
}

const ZONES = [
  { id: "all", name: "All Suburbs" },
  { id: "Avadi", name: "Avadi Central & Depot" },
  { id: "Ambattur", name: "Ambattur OT & Industrial" },
  { id: "Poonamallee", name: "Poonamallee & S.A. College" },
];

export const ExploreNearbyView: React.FC<ExploreNearbyViewProps> = ({
  reports,
  onOpenDetails,
  locationOn,
  setLocationOn,
}) => {
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (
        selectedZone !== "all" &&
        !r.neighborhood?.toLowerCase().includes(selectedZone.toLowerCase()) &&
        !r.location.toLowerCase().includes(selectedZone.toLowerCase())
      ) {
        return false;
      }
      if (selectedCategory !== "All" && r.category !== selectedCategory) {
        return false;
      }
      if (searchLocation.trim()) {
        const q = searchLocation.toLowerCase();
        return (
          r.location.toLowerCase().includes(q) ||
          r.neighborhood?.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reports, selectedZone, selectedCategory, searchLocation]);

  const activeReport = useMemo(() => {
    if (selectedReportId) {
      return reports.find((r) => r.id === selectedReportId) || null;
    }
    return filteredReports[0] || null;
  }, [selectedReportId, filteredReports, reports]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
              <Icon name="map" size={14} className="text-[#3867F6]" />
              SPATIAL DISCOVERY DESK
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif">
              Explore Nearby Reports
            </h1>
            <p className="text-base text-[#525866] max-w-xl">
              Inspect citizen reports mapped across Avadi, Ambattur, and Poonamallee corridors. Click any
              pin to highlight the verified dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-[#525866] block uppercase tracking-wider">
                Location Sharing
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {locationOn ? "Active (Simulated Avadi Hub)" : "Off (Manual Area Mode)"}
              </span>
            </div>
            <button
              onClick={() => setLocationOn(!locationOn)}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                locationOn ? "bg-[#172554]" : "bg-slate-300"
              }`}
              aria-label="Toggle location sharing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  locationOn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Disclaimer Banner required by global rules */}
        <div className="mt-6 p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] flex items-center gap-2.5 text-sm text-[#525866]">
          <Icon name="info" size={16} className="text-[#3867F6] shrink-0" />
          <span>
            <strong>Demo Spatial Demonstration:</strong> Pins represent neighborhood zones and street
            coordinates in Tamil Nadu. No live GPS tracking or fake broadcasts are performed.
          </span>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Spatial Map Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <Icon name="pin" size={16} className="text-[#F04452]" />
              Corridor Map & Report Markers
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#525866]">
              <span className="flex items-center gap-1 font-semibold text-[#171717]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F04452]" /> Urgent Issue
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#171717] ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3867F6]" /> Active Report
              </span>
            </div>
          </div>

          {/* Stylized SVG Map */}
          <div className="relative h-96 w-full rounded-xl overflow-hidden bg-slate-900 border border-[#E5E7EB] select-none">
            {/* Background Grid & Streets Vector */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60"
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Water feature: Avadi Lake / Paruthipattu */}
              <path
                d="M 50 80 Q 90 60 140 85 T 220 120 Q 180 160 110 150 Z"
                fill="#0284c7"
                opacity="0.3"
              />
              <text x="90" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold">
                Avadi Lake / Paruthipattu
              </text>

              {/* Major Highway: CTH Road */}
              <path
                d="M 20 220 C 180 200 320 220 580 180"
                stroke="#64748b"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <text x="330" y="210" fill="#cbd5e1" fontSize="10" fontWeight="bold">
                CTH Road (State Highway)
              </text>

              {/* Poonamallee High Road connector */}
              <path
                d="M 120 380 C 240 320 380 280 480 220"
                stroke="#475569"
                strokeWidth="5"
                strokeDasharray="4 4"
              />
              <text x="210" y="340" fill="#94a3b8" fontSize="9" fontWeight="bold">
                Poonamallee Bypass Connector
              </text>
            </svg>

            {/* Clickable Map Pins */}
            {reports.map((r, index) => {
              const isSelected = activeReport?.id === r.id;
              const positions = [
                { top: "35%", left: "28%" },
                { top: "72%", left: "55%" },
                { top: "42%", left: "68%" },
                { top: "38%", left: "82%" },
                { top: "25%", left: "22%" },
                { top: "80%", left: "38%" },
                { top: "50%", left: "45%" },
              ];
              const pos = positions[index % positions.length];

              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedReportId(r.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                    isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                  }`}
                  aria-label={`View report: ${r.title}`}
                >
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white ${
                        r.urgency === "Urgent" || r.type === "Live"
                          ? "bg-[#F04452] animate-bounce"
                          : isSelected
                          ? "bg-[#F5B942] text-[#171717]"
                          : "bg-[#3867F6]"
                      }`}
                    >
                      {r.type === "Live" ? "●" : "♠"}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-md mt-1 whitespace-nowrap ${
                        isSelected
                          ? "bg-[#F5B942] text-[#171717]"
                          : "bg-slate-900/90 text-white border border-slate-700"
                      }`}
                    >
                      {r.location.split("·")[0]}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* User Location marker */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-[#16845B] border-2 border-white ring-4 ring-[#16845B]/30" />
                <span className="text-[10px] font-bold text-white bg-[#16845B] px-1.5 py-0.5 rounded mt-1 shadow-xs">
                  YOU ARE HERE
                </span>
              </div>
            </div>

            {/* Map caption */}
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
              <Icon name="map" size={14} className="text-[#F5B942]" />
              <span>Avadi · Ambattur · Poonamallee Corridor</span>
            </div>
          </div>

          {/* Active Report Preview Card on Selection */}
          {activeReport && (
            <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#172554] flex items-center gap-1.5">
                  <Icon name="pin" size={14} className="text-[#F04452]" />
                  Selected Corridor Incident
                </span>
                <span className="text-[#525866]">Report #{activeReport.id}</span>
              </div>

              <div className="flex gap-4 items-start">
                {(activeReport.media || activeReport.image) && (
                  <img
                    src={activeReport.media || activeReport.image}
                    alt={activeReport.title}
                    className="w-24 h-20 rounded-lg object-cover shrink-0 border border-[#E5E7EB]"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3
                    onClick={() => onOpenDetails(activeReport)}
                    className="text-base font-bold text-[#172554] hover:text-[#3867F6] cursor-pointer line-clamp-1 font-serif"
                  >
                    {activeReport.title}
                  </h3>
                  <p className="text-sm text-[#525866] line-clamp-2 mt-1 leading-relaxed">
                    {activeReport.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#525866]">
                    <span>{activeReport.location}</span>
                    <span>•</span>
                    <button
                      onClick={() => onOpenDetails(activeReport)}
                      className="font-bold text-[#3867F6] hover:underline"
                    >
                      Open Full Story →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nearby Reports List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Zone Selector Chips */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#525866] block">
              Filter by Neighborhood Zone
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedZone === zone.id
                      ? "bg-[#3867F6] text-white"
                      : "bg-[#FAFAF7] text-[#525866] border border-[#E5E7EB] hover:bg-[#EAF0FF]/60"
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>

            {/* Location search */}
            <div className="relative pt-1">
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search street, ward, or landmark..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFAF7] border border-[#E5E7EB] rounded-lg text-[#171717] focus:outline-hidden focus:ring-1 focus:ring-[#3867F6]"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525866]">
                <Icon name="search" size={14} />
              </div>
            </div>
          </div>

          {/* List of reports in this zone */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-4 rounded-xl bg-white border transition-all cursor-pointer ${
                  activeReport?.id === report.id
                    ? "border-[#3867F6] ring-2 ring-[#3867F6]/10 shadow-xs"
                    : "border-[#E5E7EB] hover:border-[#3867F6]/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#F04452] flex items-center gap-1">
                    <Icon name="pin" size={13} /> {report.neighborhood}
                  </span>
                  {report.isDemo && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#EAF0FF] text-[#172554] font-semibold">
                      Demo content
                    </span>
                  )}
                  <span className="text-[#525866]">{report.timeAgo || "Recently"}</span>
                </div>
                <h4 className="text-base font-bold text-[#172554] line-clamp-1 font-serif">
                  {report.title}
                </h4>
                <p className="text-sm text-[#525866] line-clamp-2 mt-1 leading-relaxed">
                  {report.description}
                </p>
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#E5E7EB] text-xs">
                  <span className="text-[#525866]">{report.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(report);
                    }}
                    className="font-bold text-[#3867F6] hover:underline"
                  >
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
