import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";

export function TimeField({ value, onChange, suggestions = [] }) {
  const [internalValue, setInternalValue] = useState(value || "11:59 PM");

  useEffect(() => {
    if (value && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    setInternalValue(inputValue);
    onChange(inputValue);
  };

  const handleBlur = () => {
    let inputValue = internalValue.trim();

    // Allow only numbers, colon, and space
    inputValue = inputValue.replace(/[^\d:\s]/g, "");

    // Match 12-hour or 24-hour time format
    let match12Hour = inputValue.match(/(\d{1,2}):?(\d{0,2})?\s?(AM|PM)?/i);
    let match24Hour = inputValue.match(/^(\d{1,2}):?(\d{0,2})$/);

    let hours, minutes, period;

    if (match24Hour) {
      // Handle 24-hour format
      hours = parseInt(match24Hour[1], 10);
      minutes = match24Hour[2] ? parseInt(match24Hour[2].slice(0, 2), 10) : 0;

      // Convert 24-hour time to 12-hour format
      period = hours >= 12 ? "PM" : "AM";
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }
    } else if (match12Hour) {
      // Handle 12-hour format
      hours = parseInt(match12Hour[1] || "12", 10);
      minutes = match12Hour[2] ? parseInt(match12Hour[2].slice(0, 2), 10) : 0;
      period = match12Hour[3] ? match12Hour[3].toUpperCase() : "AM";
    } else {
      // Reset to default if invalid
      setInternalValue("11:59 PM");
      onChange("11:59 PM");
      return;
    }

    // Fix out-of-range values
    if (hours > 12) hours = 12;
    if (minutes > 59) minutes = 59;

    // Format the time properly
    let formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    setInternalValue(formattedTime);
    onChange(formattedTime);
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter time (e.g., 8:00 AM or 22:00)"
        className="w-full"
        autoComplete="off"
        maxLength={8} 
      />
      <datalist id="time-suggestions">
        {suggestions.map((suggestion, index) => (
          <option key={index} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
}
