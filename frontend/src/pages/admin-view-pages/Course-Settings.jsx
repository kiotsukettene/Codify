import { useState } from "react";
import CourseFieldsTable from "@/components/admin-view/Course-Field-Table";
import TabNavigation from "@/components/admin-view/Tab-Navigation";

export default function CourseSetting() {
  const [selectedType, setSelectedType] = useState("ClassName");

  const handleTypeChange = (type) => {
    console.log(`[Course-Settings] Switching to type ${type}`);
    setSelectedType(type);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <main className="flex flex-col flex-1 w-full px-4 py-10">
        <TabNavigation onTypeChange={handleTypeChange} />
        <div className="mt-6 bg-white rounded-md shadow-sm flex-1 flex flex-col">
          <CourseFieldsTable type={selectedType} />
        </div>
      </main>
    </div>
  );
}
