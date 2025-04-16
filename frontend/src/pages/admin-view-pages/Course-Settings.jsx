import { useState } from "react";
import Header from "@/components/admin-view/Header";
import CourseFieldsTable from "@/components/admin-view/Course-Field-Table";
import TabNavigation from "@/components/admin-view/Tab-Navigation";

export default function CourseSetting() {
  // State to track the selected type from TabNavigation
  const [selectedType, setSelectedType] = useState("ClassName");

  // Handle type change from TabNavigation
  const handleTypeChange = (type) => {
    console.log(`Course-Settings: Switching to type ${type}`);
    setSelectedType(type);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-ilibre.com/gray-50">
      <main className="flex flex-col flex-1 w-full px-4 py-6">
        {/* Pass handleTypeChange to TabNavigation */}
        <TabNavigation onTypeChange={handleTypeChange} />
        <div className="mt-6 bg-white rounded-md shadow-sm flex-1 flex flex-col">
          {/* Pass selectedType to CourseFieldsTable */}
          <CourseFieldsTable type={selectedType} />
        </div>
      </main>
    </div>
  );
}
