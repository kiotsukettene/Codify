import React from "react";
import { Input } from "@/components/ui/input";

const ScoreInput = ({ studentId, value, onChange }) => {
  return (
    <Input
      type="number"
      min="0"
      max="100"
      value={value || 0}
      onChange={(e) => onChange(studentId, e.target.value)}
      className="w-16 text-center"
      placeholder="Score"
    />
  );
};

export default ScoreInput;
