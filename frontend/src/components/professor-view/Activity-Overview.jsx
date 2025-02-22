import React from "react";
import { motion } from "framer-motion";

const ActivityOverview = ({ dueDate, points, instructions, exampleOutput, fileName = "No file uploaded" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 w-full mx-auto p-4"
    >
      {/* Due Date & Points */}
      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 text-sm mb-8 gap-2">
        <span>Due date: {dueDate}</span>
        <span>{points} Points</span>
      </div>

      {/* File Preview Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border rounded-lg p-4 bg-gray-50"
      >
        <h2 className="font-medium mb-4">Uploaded File:</h2>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className={`${!fileName || fileName === "No file uploaded" ? "text-gray-400 italic" : ""}`}>
            {fileName}
          </span>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-medium mb-4">Instructions:</h2>
        <ol className="list-decimal pl-5 space-y-4">
          {instructions.map((instruction, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {instruction}
            </motion.li>
          ))}
        </ol>
      </motion.div>

      {/* Example Output */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-medium mb-4">Example Output:</h2>
        <pre className="font-mono text-sm whitespace-pre-line bg-gray-100 p-4 rounded-md overflow-x-auto">
          {exampleOutput}
        </pre>
      </motion.div>
    </motion.div>
  );
};

export default ActivityOverview;
