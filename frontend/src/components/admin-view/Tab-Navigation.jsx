import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TabNavigation() {
  const tabs = [
    "Class Names",
    "Programs",
    "Years",
    "Sections",
    "Programming Languages",
    "Days",
    "Time Slots",
  ];

  const [activeTab, setActiveTab] = useState("Class Names");

  return (
    <div className="border-b border-gray-200">
      <nav className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium whitespace-nowrap",
              activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
