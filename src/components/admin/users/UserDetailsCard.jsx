/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { format } from "date-fns";
import {
  approveAll100x,
  approveAll10x,
  approveAllDay0,
  approveAllReq,
  rejectAllReq,
} from "@/services/admin";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const predefinedReasons = [
  { value: "recharged", label: "A Recharged Self" },
  { value: "vision", label: "A Clearer Vision" },
  { value: "health", label: "A Healthier Body and Mind" },
  { value: "joy", label: "Deeper Inner Joy" },
  { value: "friendships", label: "Lifelong Conscious Friendships" },
];

const predefinedGrowthAreas = [
  { value: "clarity", label: "Mental Clarity" },
  { value: "energy", label: "Physical Energy" },
  { value: "emotional", label: "Emotional healing" },
  { value: "peace", label: "Inner peace" },
  { value: "purpose", label: "Connection to Purpose" },
  { value: "community", label: "A conscious community" },
];

const predefinedExperiences = [
  { value: "retreat", label: "A retreat" },
  { value: "book", label: "A life changing book" },
  { value: "mentor", label: "A Transformational Mentor" },
  { value: "travel", label: "Deep Travel" },
  { value: "healing", label: "Personal Healing" },
  { value: "searching", label: "Still Searching" },
];

const predefinedRealizations = [
  {
    value: "restlessness",
    label: "Inner Restlessness",
  },
  {
    value: "burnout",
    label: "Burnout Signs",
  },
  {
    value: "health",
    label: "Desire for a Healthier Life",
  },
  {
    value: "disconnected",
    label: "Feeling Disconnected",
  },
  {
    value: "meaning",
    label: "Craving Deeper Meaning",
  },
  {
    value: "intuitive",
    label: "Intuitive Calling",
  },
];

// Event categories in hierarchical order (lowest to highest)
const eventCategories = [
  { value: "day0", label: "Day 0", color: "green" },
  { value: "10x", label: "10x", color: "blue" },
  { value: "100x", label: "100x", color: "purple" },
];

export default function UserDetailsCard({ user }) {
  const [collapsed, setCollapsed] = useState({
    personal: false,
    professional: false,
    links: false,
    journey: false,
    events: false,
  });

  // const [approvalStatus, setApprovalStatus] = useState(null); // null, 'approved', 'rejected'
  // const [approvedCategory, setApprovedCategory] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  // Mock data for events the user has applied for (replace with actual data from your user object)
  // eslint-disable-next-line no-unused-vars
  const [appliedEvents, setAppliedEvents] = useState(
    user.requests || [
      { category: "day0", name: "Intro Meditation", date: "2025-05-15" },
      { category: "10x", name: "Weekend Retreat", date: "2025-06-10" },
      { category: "100x", name: "Advanced Retreat", date: "2025-07-20" },
    ]
  );

  const getUserState = (state) => {
    if (state === "thriving") {
      return "Thriving but seeking deeper meaning";
    } else if (state === "turning") {
      return "At a turning point";
    } else if (state === "reset") {
      return "ready for a full reset and renewal";
    }
  };

  const getUserReady = (state) => {
    if (state === "100") {
      return "Fully ready";
    } else if (state === "mostly") {
      return "Mostly ready";
    } else if (state === "reset") {
      return "Still opening to it";
    }
  };

  const getApprovedFor = (joined) => {
    if (joined === 0) {
      return "None";
    } else if (joined === 1) {
      return "Day 0";
    } else if (joined === 2) {
      return "10x";
    } else if (joined === 3) {
      return "100x";
    }
  };

  const handleApproveAll = async () => {
    try {
      await approveAllReq({ token: token, userId: user._id, setLoading });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectAll = async () => {
    try {
      await rejectAllReq({ token: token, userId: user._id, setLoading });
    } catch (error) {
      console.log(error);
    }
  };
  const handleApproveDay0 = async () => {
    try {
      await approveAllDay0({ token: token, userId: user._id, setLoading });
    } catch (error) {
      console.log(error);
    }
  };
  const handleApprove10x = async () => {
    try {
      await approveAll10x({ token: token, userId: user._id, setLoading });
    } catch (error) {
      console.log(error);
    }
  };
  const handleApprove100x = async () => {
    try {
      await approveAll100x({ token: token, userId: user._id, setLoading });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-10 pb-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.designation}</p>
          </div>
          <div className="text-sm text-gray-600 text-right">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {user.phone}{" "}
            </p>
            <p>
              <span className="font-medium">Approved For:</span>{" "}
              {getApprovedFor(user.allowed)}
            </p>
          </div>
        </div>
      </div>

      {/* Events Applied Section */}
      <CollapsibleSection
        title="Events Applied"
        isOpen={!collapsed.events}
        onToggle={() =>
          setCollapsed((prev) => ({ ...prev, events: !prev.events }))
        }
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appliedEvents.map((event, idx) => {
                  const categoryInfo = eventCategories.find(
                    (c) => c.value === event.category
                  );
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}
                        >
                          {categoryInfo.label}
                        </span>
                      </td>
                      {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Approval Actions */}
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Approve user for category (includes all lower categories):
            </p>
            {loading ? (
              <>
                <ClipLoader />
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <button
                    onClick={handleApproveAll}
                    className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                  bg-green-500 text-white hover:scale-105 duration-200
                  `}
                  >
                    <span>Approve All</span>
                  </button>

                  <button
                    onClick={handleRejectAll}
                    className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                bg-red-500 text-white hover:scale-105 duration-200
                `}
                  >
                    <span>Reject All</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApproveDay0()}
                    // disabled={
                    //   approvalStatus === "approved" &&
                    //   eventCategories.findIndex(
                    //     (c) => c.value === approvedCategory
                    //   ) >=
                    //     eventCategories.findIndex((c) => c.value === category.value)
                    // }
                    className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                    hover:scale-105 duration-200
                  `}
                  >
                    <span>Approve for Day0</span>
                    {/* {approvalStatus === "approved" &&
                  approvedCategory === category.value && (
                    <Check size={16} className="ml-2" />
                  )} */}
                  </button>

                  <button
                    onClick={() => handleApprove10x()}
                    className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                    hover:scale-105 duration-200
                  `}
                  >
                    <span>Approve for 10x</span>
                  </button>

                  <button
                    onClick={() => handleApprove100x()}
                    className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                    hover:scale-105 duration-200
                  `}
                  >
                    <span>Approve for 100x</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Collapsible Section: Personal Info */}
      <CollapsibleSection
        title="Personal Info"
        isOpen={!collapsed.personal}
        onToggle={() =>
          setCollapsed((prev) => ({ ...prev, personal: !prev.personal }))
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Section label="Gender" value={user.gender} />
          <Section
            label="Date of Birth"
            value={format(new Date(user.dob), "MMMM d, yyyy")}
          />
          <Section label="Field" value={user.journey} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title={"Journey"}
        isOpen={!collapsed.journey}
        onToggle={() =>
          setCollapsed((prev) => ({ ...prev, journey: !prev.journey }))
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <TagListSection
            label="Most beautiful experience for personal growth so far"
            values={user.experience}
            options={predefinedExperiences}
            bg={"red"}
          />
          <TagListSection
            label="What made you realize it's time to adapt or shift something within you?"
            values={user.reason}
            options={predefinedRealizations}
            bg={"blue"}
          />
        </div>
      </CollapsibleSection>

      {/* Collapsible Section: Professional Info */}
      <CollapsibleSection
        title="Focus Areas"
        isOpen={!collapsed.professional}
        onToggle={() =>
          setCollapsed((prev) => ({
            ...prev,
            professional: !prev.professional,
          }))
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <TagListSection
            label="Areas of life that needs attention"
            values={user?.area?.map((g) => g.trim())}
            options={predefinedGrowthAreas}
            bg={"red"}
          />
          <Section label="Present state" value={getUserState(user.state)} />
          <TagListSection
            label="Wants to bloom"
            values={user?.bloom?.map((r) => r)}
            options={predefinedReasons}
            bg={"blue"}
          />
          <Section label="Readiness" value={getUserReady(user.ready)} />
          <ParagraphSection label="Notes" value={user.notes} />
        </div>
      </CollapsibleSection>
    </div>
  );
}

function Section({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 uppercase tracking-wide text-xs font-semibold mb-1">
        {label}
      </p>
      {Array.isArray(value) ? (
        <div className="flex flex-col gap-1">
          {value.map((item, index) => (
            <div key={index} className="text-gray-800 font-medium capitalize">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-800 font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

function LinkBlock({ label, href, display }) {
  if (!href) return null;
  return (
    <div>
      <p className="text-gray-400 uppercase tracking-wide text-xs font-semibold mb-1">
        {label}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline break-words font-medium"
      >
        {display}
      </a>
    </div>
  );
}

function CollapsibleSection({ title, children, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-4"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function ParagraphSection({ label, value }) {
  return (
    <div className="col-span-full">
      <p className="text-gray-400 uppercase tracking-wide text-xs font-semibold mb-1">
        {label}
      </p>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {value || "—"}
      </p>
    </div>
  );
}

function TagListSection({ label, values, options, bg }) {
  const optionValues = options.map((o) => o.value);
  const matchedValues = values?.filter((v) => optionValues.includes(v)) || [];

  const matched = matchedValues.map((v) => {
    const match = options.find((o) => o.value === v);
    return match ? match.label : v;
  });

  return (
    <div className="col-span-full">
      <p className="text-gray-400 uppercase tracking-wide text-xs font-semibold mb-1">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {matched && matched.length > 0 ? (
          matched.map((tag) => (
            <span
              key={tag}
              className={`bg-${bg}-100 text-${bg}-800 text-xs px-3 py-1 rounded-full`}
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-gray-600">No selections</span>
        )}
      </div>
    </div>
  );
}
