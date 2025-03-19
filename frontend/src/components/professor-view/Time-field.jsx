import React from "react";

const TimeField = ({ value, onChange }) => {
  return (
    <input
      type="time"
      className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-purple-400 focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)} 

    />
  );
};

export default TimeField;
