import { useState } from "react";
import { motion } from "framer-motion";

const formatTypeForDisplay = (type) => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function TabNavigation({ onTypeChange }) {
  const [activeTab, setActiveTab] = useState("ClassName");

  const tabs = ["ClassName", "Program", "Year", "Section"];

  const handleTabClick = (type) => {
    console.log(
      `TabNavigation: Selected type ${type} (displayed as ${formatTypeForDisplay(
        type
      )})`
    );
    setActiveTab(type);
    onTypeChange(type);
  };

  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
    className="flex space-x-4 border-b border-gray-200">
      {tabs.map((type) => (
        <button
          key={type}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === type
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabClick(type)}
        >
          {formatTypeForDisplay(type)}
        </button>
      ))}
    </motion.div>
  );
}