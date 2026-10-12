import React, { useState } from "react";
import { Screen } from "../types";
import { Icon } from "../components/Icon";

interface HelpGuidelinesViewProps {
  setScreen: (screen: Screen) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does SPADE verify reports before publishing?",
    answer:
      "Every report submitted on SPADE goes through a multi-step check. First, automated checks verify image metadata and remove duplicate posts. Next, nearby spaders within the Avadi and Ambattur corridors are prompted to corroborate or flag the incident. Finally, senior community spaders check facts against civic records before tagging the report as 'Verified'.",
  },
  {
    question: "What should I NOT report on SPADE?",
    answer:
      "SPADE is dedicated to public infrastructure, urban transit, environmental hazards, and community affairs. Do not report active violent crimes in progress, private disputes between neighbors, commercial advertisements, or unverified rumors. For immediate emergencies, always call 112 directly first.",
  },
  {
    question: "How do I become a credentialed 'SPADE Journalist'?",
    answer:
      "Contributors earn SPADE Journalist credentials by maintaining an active 6-month reporting history, filing at least 10 corroborated reports, and keeping a community trust score above 90% without editorial guidelines violations.",
  },
  {
    question: "Are my GPS coordinates and identity public?",
    answer:
      "No. Exact GPS coordinates are never exposed publicly unless you specifically authorize geotagging. Reports only show general landmarks (e.g., 'Avadi Bus Depot exit' or 'CTH Road'). Your phone number and email are never shared.",
  },
  {
    question: "How are civic authorities notified?",
    answer:
      "When a report reaches 3 or more local corroborations and is marked 'Corporation notified', our civic liaison dashboard routes the ticket ID directly to ward engineers at Avadi Municipal Corporation or Greater Chennai Corporation (GCC).",
  },
];

export const HelpGuidelinesView: React.FC<HelpGuidelinesViewProps> = ({ setScreen }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#172554]">
          <Icon name="shield-check" size={13} className="text-[#3867F6]" />
          EDITORIAL CHARTER & STANDARDS
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight font-serif">
          Community Reporting Guidelines
        </h1>
        <p className="text-base text-[#525866] leading-relaxed">
          SPADE is built on trust, verification, and constructive public impact. Here is how citizen
          journalists, local residents, and ward monitors work together responsibly.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setScreen("create")}
            className="px-5 py-2.5 bg-[#3867F6] hover:bg-[#2753db] text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#3867F6]"
          >
            <Icon name="plus" size={16} />
            <span>File a Responsible Report</span>
          </button>
          <button
            onClick={() => setScreen("feed")}
            className="px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#EAF0FF]/60 text-sm font-bold text-[#171717] rounded-xl transition-colors cursor-pointer"
          >
            Explore Verified Feed
          </button>
        </div>
      </div>

      {/* Emergency Helpline Strip */}
      <div className="bg-[#FFF0F0] border border-[#F04452]/20 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F04452] text-white flex items-center justify-center shrink-0">
            <Icon name="alert-triangle" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172554]">Immediate Life Safety Emergencies</h3>
            <p className="text-xs text-[#525866] mt-0.5">
              Never wait for a web report during active fires, medical emergencies, or dangerous crimes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-mono font-bold text-[#172554]">
          <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E5E7EB]">Police: 100</span>
          <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E5E7EB]">Ambulance: 108</span>
          <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E5E7EB]">GCC Helpline: 1913</span>
        </div>
      </div>

      {/* 5 Core Editorial Pillars */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-2xl font-bold text-[#172554] font-serif flex items-center gap-2">
          <span className="text-[#F5B942] font-serif text-2xl">♠</span>
          The 5 Pillars of SPADE Citizen Journalism
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-2">
            <span className="text-xs font-bold text-[#3867F6] block font-mono">PILLAR 01</span>
            <h3 className="text-base font-bold text-[#171717]">Truthfulness & Direct Witness</h3>
            <p className="text-sm text-[#525866] leading-relaxed">
              Report only what you witnessed personally or documented firsthand with time and date.
              Do not amplify unconfirmed social media forwards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-2">
            <span className="text-xs font-bold text-[#3867F6] block font-mono">PILLAR 02</span>
            <h3 className="text-base font-bold text-[#171717]">Public Safety Comes First</h3>
            <p className="text-sm text-[#525866] leading-relaxed">
              Never put yourself or bystanders at physical risk to capture photographic or video proof
              near active construction, flooding, or traffic.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-2">
            <span className="text-xs font-bold text-[#3867F6] block font-mono">PILLAR 03</span>
            <h3 className="text-base font-bold text-[#171717]">Privacy & Dignity Protection</h3>
            <p className="text-sm text-[#525866] leading-relaxed">
              Do not publish faces of minors, accident victims, or private vehicle license plates
              without legitimate public-interest necessity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-2">
            <span className="text-xs font-bold text-[#3867F6] block font-mono">PILLAR 04</span>
            <h3 className="text-base font-bold text-[#171717]">Neutral & Factual Tone</h3>
            <p className="text-sm text-[#525866] leading-relaxed">
              State clear facts: where, when, what broke, and who is affected. Avoid defamatory
              allegations, inflammatory language, or speculation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E7EB] space-y-2 sm:col-span-2">
            <span className="text-xs font-bold text-[#3867F6] block font-mono">PILLAR 05</span>
            <h3 className="text-base font-bold text-[#171717]">Accountability & Follow-Through</h3>
            <p className="text-sm text-[#525866] leading-relaxed">
              Once an issue is resolved by municipal workers (e.g., potholes filled, water pipe
              welded), post a verified closure update so the community record reflects the fix.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Lifecycle Flowchart */}
      <div className="bg-[#172554] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        <h2 className="text-2xl font-bold font-serif text-white">How a Report Reaches Resolution</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          From the moment you tap &quot;Submit&quot;, our collaborative civic workflow keeps everyone
          informed:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#F5B942] text-[#171717] font-bold text-xs flex items-center justify-center font-mono">
              1
            </span>
            <h4 className="text-sm font-bold text-white">Submission</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Logged in session and shared feed marked &quot;Under review&quot;.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#F5B942] text-[#171717] font-bold text-xs flex items-center justify-center font-mono">
              2
            </span>
            <h4 className="text-sm font-bold text-white">Corroboration</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nearby residents upvote or add witness comments confirming the issue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#F5B942] text-[#171717] font-bold text-xs flex items-center justify-center font-mono">
              3
            </span>
            <h4 className="text-sm font-bold text-white">Civic Ticket</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Status changes to &quot;Corporation notified&quot; with ticket logged.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#F5B942] text-[#171717] font-bold text-xs flex items-center justify-center font-mono">
              4
            </span>
            <h4 className="text-sm font-bold text-white">Resolution</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Follow-up photo confirms repair and issue is marked &quot;Resolved&quot;.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-2xl font-bold text-[#172554] font-serif">Frequently Asked Questions</h2>
        <div className="divide-y divide-[#E5E7EB]">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-base font-bold text-[#171717] hover:text-[#3867F6] py-1 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <Icon
                    name="chevron-down"
                    size={16}
                    className={`transition-transform text-[#525866] ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-sm text-[#525866] mt-2 leading-relaxed animate-fade-in pl-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
