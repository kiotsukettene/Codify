// frontend/src/components/student-view/Input.jsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

const Input = ({ isMaximized, onToggleMaximize, onInputChange }) => {
  const [inputValue, setInputValue] = useState(
    "Example only \n3\n1 2 3\n4\n4 5 6 7\n3\n9 10 11\n"
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange(newValue); // Notify parent of input change
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-gray-800">
        <span className="text-gray-300 text-sm">Input</span>
        <Button variant="ghost" size="sm" onClick={onToggleMaximize} className="text-gray-400">
          {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-120px)] w-full">
        <div className="p-0">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your input here..."
            className="min-h-[calc(100vh-120px)] bg-[#1e1e1e] text-gray-200 border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 p-4"
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: "21px",
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Input;