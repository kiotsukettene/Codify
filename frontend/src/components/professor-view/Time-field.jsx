import React, { useState } from "react";

const TimeField = ({ value, onChange, minTime, isToday, disabled }) => {
  const [error, setError] = useState("");

  // Format minTime to HH:mm format for the input's min attribute
  const formatMinTime = (date) => {
    if (!date) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes() + 1).padStart(2, "0"); // Add 1 minute to exclude current time
    return `${hours}:${minutes}`;
  };

  // Validate selected time
  const handleTimeChange = (newValue) => {
    if (isToday && newValue) {
      const [hours, minutes] = newValue.split(":").map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);
      
      if (selectedTime <= minTime) {
        setError("The selected time is unavailable. Choose a later time.");
        onChange(""); // Clear invalid time
        return;
      }
    }
    setError("");
    onChange(newValue);
  };

  return (
    <div>
      <input
        type="time"
        className={`w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-purple-400 focus-visible:outline-none ${
          disabled ? "bg-gray-200 cursor-not-allowed" : error ? "border-red-500" : ""
        }`}
        value={value}
        onChange={(e) => handleTimeChange(e.target.value)}
        min={isToday && !disabled ? formatMinTime(minTime) : undefined}
        disabled={disabled}
      />
      {disabled && (
        <p className="text-sm text-red-500 mt-1">
          No valid times available for today. Please select a future date.
        </p>
      )}
      {error && !disabled && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default TimeField;