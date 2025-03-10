import React from "react";
import { Button } from "../ui/button";

const StudentLessonContent = ({ title, content, codeSnippets, notes }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Lesson Title */}
      <h2 className="font-medium text-xl text-gray-900 rounded-md p-2 bg-purple-100/80">
        {title}
      </h2>

      {/* Lesson Content */}
      <p className="text-gray-800 text-sm mt-4 leading-7 text-justify">
        {content}
      </p>

      {codeSnippets && codeSnippets.length > 0 && (
        <div className="relative bg-[#1e1e1e] rounded-lg mb-6 overflow-hidden">
          <pre className="p-4 pt-8 font-mono text-xs text-purple-200">
            <code>{codeSnippets.join("\n")}</code>
          </pre>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className=" dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Notes:</h3>
          <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300">
            {notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentLessonContent;
